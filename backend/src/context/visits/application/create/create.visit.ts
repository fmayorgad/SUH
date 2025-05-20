import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { VisitRepository } from '../../domain/visit.repository';
import { CreateVisitDTO } from '../../infraestructure/dto/create.visit.dto';
import { Visit } from '@models/visit.model';
import { Repository, In, QueryRunner, DataSource } from 'typeorm';
import { PgsqlWeekgroupVisitRepository } from '@context/weekgroupvisit/infraestructure/persistence/pgsql.weekgroupvisit.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { WeekgroupVisitSchema } from '@schemas/weekgroupvisit.schema';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { PrestadorSchema } from '@schemas/prestador.schema';
import { FiscalYearSchema } from '@schemas/fiscalyear.schema';
import { Prestador } from '@models/prestador.model';
import { FiscalYear } from '@models/fiscalyears.model';
import { VisitSchema } from '@schemas/visit.schema';
import { WeekGroupsPrestadoresEnum } from '@enums/weekgroupsprestadores';
import { Payload } from '@models/payload.model';
import * as ExcelJS from 'exceljs';
import { PrestadorFiscalyearInformation } from '@models/prestador-fiscalyear-information.model';
import { MunicipioSchema } from '@schemas/municipio.schema';
import { Municipio } from '@models/municipio.model';
import { PrestadorFiscalyearInformationSchema } from '@schemas/prestador-fiscalyear-information.schema';
import { PrestadorFiscalyearServicios } from '@models/prestador-fiscalyear-servicios.model';
import { generalStateTypes } from '@enums/general-state-type';
import { ServicioSchema } from '@schemas/servicio.schema';
import { Servicio } from '@models/servicio.model';
import { PrestadorFiscalyearServiciosSchema } from '@schemas/prestador-fiscalyear-servicios.schema';
import { VisitVerificadores } from '@models/visit_verificadores.model';
import { VisitVerificadoresSchema } from '@schemas/visit_verificadores.schema';
import { UserSchema } from '@schemas/user.schema';
import { Users } from '@models/user.model';
import { VisitServicios } from '@models/visit_servicios.model';
// Define local interface for Multer file
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class CreateVisit {
  constructor(
    @Inject('PgsqlVisitRepository')
    private readonly visitRepository: VisitRepository,
    @InjectRepository(VisitSchema)
    private readonly visitTypeOrmRepository: Repository<Visit>,
    @InjectRepository(WeekgroupVisitSchema)
    private readonly weekgroupVisitRepository: Repository<WeekgroupVisit>,
    @InjectRepository(MunicipioSchema)
    private readonly municipioRepository: Repository<Municipio>,
    @InjectRepository(PrestadorFiscalyearInformationSchema)
    private readonly prestadorFiscalyearInformationRepository: Repository<PrestadorFiscalyearInformation>,
    @InjectRepository(ServicioSchema)
    private readonly servicioRepository: Repository<Servicio>,
    @InjectRepository(PrestadorFiscalyearServiciosSchema)
    private readonly prestadorFiscalyearServiciosRepository: Repository<PrestadorFiscalyearServicios>,
    @InjectRepository(VisitVerificadoresSchema)
    private readonly visitVerificadoresRepository: Repository<VisitVerificadores>,
    @InjectRepository(UserSchema)
    private readonly usersRepository: Repository<Users>,
    private readonly dataSource: DataSource,
  ) { }

  // Helper function to extract email from Excel cell value that might be an object
  private extractEmail(value: any): string {
    if (!value) return '';

    // If it's already a string, return it
    if (typeof value === 'string') return value;

    // If it's a Excel email hyperlink object
    if (typeof value === 'object') {
      // Check if it has a text property (typical for Excel hyperlinks)
      if (value.text) return value.text;

      // Check if it has an email property
      if (value.email) return value.email;

      // If it has an address property (some Excel formats)
      if (value.address) return value.address;

      // Try to convert the entire object to a string
      try {
        return value.toString();
      } catch (e) {
        console.log('Failed to convert Excel email object to string:', value);
        return '';
      }
    }

    // Default case - try to stringify
    return String(value);
  }

  async run(
    createVisitDto: CreateVisitDTO,
    files?: { serviciosFile?: MulterFile[], capacidadFile?: MulterFile[] },
    userId?: string,
    userPayload?: Payload
  ) {
    // Create a query runner for transaction management
    const queryRunner = this.dataSource.createQueryRunner();

    // Start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const weekgroupVisit = await this.weekgroupVisitRepository.findOne({
        where: { id: createVisitDto.weekgroupVisitId },
        relations: {
          weekgroup: {
            weeks: {
              fiscalyears: true
            }
          },
          lead: true,
          prestador: true
        }
      });

      if (!weekgroupVisit) {
        throw new NotFoundException(`WeekgroupVisit with ID ${createVisitDto.weekgroupVisitId} not found`);
      }

      // If user is not a PROGRAMADOR, validate user is the lead
      if (userPayload && userPayload.profile?.name !== 'PROGRAMADOR') {
        const isLead = weekgroupVisit.lead?.id === userPayload.sub;
        
        if (!isLead) {
          await queryRunner.rollbackTransaction();
          await queryRunner.release();
          throw new ForbiddenException('Solo el líder de la visita puede crear la visita');
        }
      }

      const weekgroupFiscalYear = weekgroupVisit.weekgroup.weeks.fiscalyears;

      //We need to validate there is no other visit for the same prestador and the fiscalyear
      const existingVisit = await this.visitTypeOrmRepository.findOne({
        where: {
          prestador: { id: weekgroupVisit.prestador.id },
          fiscalYear: { id: weekgroupFiscalYear.id }
        }
      });

      if (existingVisit) {
        throw new BadRequestException(
          ['Ya existe una Visita para el Prestador y el Año Fiscal actual'],
          {
            cause: new Error(),
            description: 'Ya existe una Visita para el Prestador y el Año Fiscal actual',
          },
        );
      }

      //validate if there is another vsit for the same fiscalyear and sade
      const existingVisitByFiscalYearAndSade = await this.visitTypeOrmRepository.findOne({
        where: {
          fiscalYear: { id: weekgroupFiscalYear.id },
          sade: createVisitDto.sade
        }
      });

      if (existingVisitByFiscalYearAndSade) {
        throw new BadRequestException(
          ['Ya existe una Visita para el Año Fiscal y el SADE'],
          {
            cause: new Error(),
            description: 'Ya existe una Visita para el Año Fiscal y el SADE',
          },
        );
      }

      // Process Excel files if provided
      let serviciosData = null;
      let capacidadData = null;

      if (files?.serviciosFile && files.serviciosFile.length > 0) {
        serviciosData = await this.readServiciosExcel(files.serviciosFile[0]);
      }

      if (files?.capacidadFile && files.capacidadFile.length > 0) {
        capacidadData = await this.readCapacidadExcel(files.capacidadFile[0]);
      }

      /* here, we are going to create an PrestadorFiscalyearInformation object, reading the second row 
        that will have the information that completes the information of the Prestador
      */
      const dataPrestadorFiscalyearInformation = await this.createPrestadorFiscalyearInformation(serviciosData[0], weekgroupVisit, weekgroupFiscalYear);

      // Save the prestadorFiscalyearInformation using the transaction
      const prestadorFiscalyearInfoRepo = queryRunner.manager.getRepository(PrestadorFiscalyearInformation);
      const storedPrestadorFiscalyearInformation = await prestadorFiscalyearInfoRepo.save(dataPrestadorFiscalyearInformation);

      //if the prestadorFiscalyearInformation is not stored, we throw an error
      if (!storedPrestadorFiscalyearInformation) {
        throw new BadRequestException(
          ['Error al almacenar la información del prestador fiscal del año'],
          {
            cause: new Error(),
            description: 'Error al almacenar la información del prestador fiscal del año',
          },
        );
      }

      //generate the information for the prestador_fiscalyear_services
      const prestadorFiscalyearServices = await this.generate_Prestador_fiscalyear_services(storedPrestadorFiscalyearInformation, serviciosData);

      //store the prestador_fiscalyear_services using the transaction
      const prestadorFiscalyearServiciosRepo = queryRunner.manager.getRepository(PrestadorFiscalyearServicios);
      await prestadorFiscalyearServiciosRepo.save(prestadorFiscalyearServices);

      const visitToStoreData = {
        ...createVisitDto,
        prestadorId: weekgroupVisit.prestador.id,
        fiscalYearId: weekgroupFiscalYear.id,
        createdBy: userId
      }

      console.log('Creating visit with user ID:', userId);
      // Use the repository with the transaction
      const visit = await this.visitRepository.create(visitToStoreData, queryRunner);

      // Create visit verificadores if provided in the DTO
      if (createVisitDto.members && createVisitDto.members.length > 0) {
        await this.createVisitVerificadores(createVisitDto.members, visit.id, queryRunner);
      }

      // Create visit servicios if provided in the DTO
      if (createVisitDto.servicios && createVisitDto.servicios.length > 0) {
        await this.createVisitServicios(createVisitDto.servicios, visit.id, queryRunner);
      }

      //if the visit is created successfully, we need to update the weekgroupvisit visit_state to 'completed'
      await queryRunner.manager.update(
        WeekgroupVisit,
        { id: createVisitDto.weekgroupVisitId },
        { visitState: WeekGroupsPrestadoresEnum.COMPLETADA }
      );

      // Commit the transaction after everything is successful
      await queryRunner.commitTransaction();

      return visit;
    } catch (error) {
      // Rollback transaction in case of any error
      console.error('Error creating visit, rolling back transaction:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  private async createVisitVerificadores(userIds: string[], visitId: string, queryRunner: QueryRunner, role: string = 'VERIFICADOR'): Promise<void> {
    // Get the users by their IDs
    const users = await this.usersRepository.find({
      where: { id: In(userIds) }
    });

    if (users.length !== userIds.length) {
      const foundUserIds = users.map(user => user.id);
      const missingUserIds = userIds.filter(id => !foundUserIds.includes(id));
      throw new BadRequestException(
        [`No se encontraron los siguientes usuarios: ${missingUserIds.join(', ')}`],
        {
          cause: new Error(),
          description: 'Algunos usuarios verificadores no existen',
        },
      );
    }

    // Create VisitVerificadores entities
    const visitVerificadores = users.map(user => {
      const visitVerificador = new VisitVerificadores();
      visitVerificador.user_id = user;
      visitVerificador.visit_id = { id: visitId } as Visit;
      visitVerificador.role = role as any;
      visitVerificador.state = generalStateTypes.ACTIVO;
      return visitVerificador;
    });

    // Save all visit verificadores using the transaction
    const visitVerificadoresRepo = queryRunner.manager.getRepository(VisitVerificadores);
    await visitVerificadoresRepo.save(visitVerificadores);
  }

  private async createVisitServicios(servicioIds: string[], visitId: string, queryRunner: QueryRunner): Promise<void> {
    // Get the servicios by their IDs
    const servicios = await this.servicioRepository.find({
      where: { id: In(servicioIds) }
    });

    if (servicios.length !== servicioIds.length) {
      const foundServicioIds = servicios.map(servicio => servicio.id);
      const missingServicioIds = servicioIds.filter(id => !foundServicioIds.includes(id));
      throw new BadRequestException(
        [`No se encontraron los siguientes servicios: ${missingServicioIds.join(', ')}`],
        {
          cause: new Error(),
          description: 'Algunos servicios no existen',
        },
      );
    }

    // Create VisitServicios entities
    const visitServicios = servicios.map(servicio => {
      const visitServicio = new VisitServicios();
      visitServicio.servicio_id = servicio;
      visitServicio.visit_id = { id: visitId } as Visit;
      visitServicio.state = generalStateTypes.ACTIVO;
      return visitServicio;
    });

    // Save all visit servicios using the transaction
    const visitServiciosRepo = queryRunner.manager.getRepository(VisitServicios);
    await visitServiciosRepo.save(visitServicios);
  }

  private async readServiciosExcel(file: MulterFile): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.getWorksheet(1); // Get the first worksheet
    const data = [];

    // Find how many columns to read (up to column CR or until finding "correo representante")
    let maxColumn = 0;
    let headers = [];

    // Process header row (row 1)
    const headerRow = worksheet.getRow(1);
    let foundCorreoPrestador = false;

    // Read all column headers until column CQ (95) or until "correo_representante" is found
    for (let colIndex = 1; colIndex <= 95; colIndex++) {
      const headerValue = headerRow.getCell(colIndex).value?.toString().trim().toLowerCase() || '';

      if (headerValue) {
        headers.push(headerValue);
        maxColumn = colIndex;

        // If we found the "correo representante" column, we can stop
        if (headerValue === 'correo_representante') {
          foundCorreoPrestador = true;
          break;
        }
      } else if (colIndex > 5 && !headerValue) {
        // If we find an empty header after column 5, we can assume there are no more headers
        // unless we've just not reached "correo representante" yet
        if (!foundCorreoPrestador && colIndex < 95) {
          continue;
        } else {
          break;
        }
      }
    }

    // Process data rows
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const rowData = {};
        // Use headers as keys
        for (let colIndex = 1; colIndex <= maxColumn; colIndex++) {
          if (headers[colIndex - 1]) {
            const cellValue = row.getCell(colIndex).value;

            // Special handling for email columns
            if (headers[colIndex - 1] === 'correo_representante' ||
              headers[colIndex - 1] === 'email') {
              rowData[headers[colIndex - 1]] = this.extractEmail(cellValue);
            } else {
              rowData[headers[colIndex - 1]] = cellValue?.toString() || '';
            }
          }
        }

        data.push(rowData);
      }
    });

    return data;
  }

  private async readCapacidadExcel(file: MulterFile): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.getWorksheet(1); // Get the first worksheet
    const data = [];

    // Find how many columns to read (up to column CR or until finding "correo representante")
    let maxColumn = 0;
    let headers = [];

    // Process header row (row 1)
    const headerRow = worksheet.getRow(1);
    let foundCorreoPrestador = false;

    // Read all column headers until column CR (96) or until "correo representante" is found
    for (let colIndex = 1; colIndex <= 96; colIndex++) {
      const headerValue = headerRow.getCell(colIndex).value?.toString().trim().toLowerCase() || '';

      if (headerValue) {
        headers.push(headerValue);
        maxColumn = colIndex;

        // If we found the "correo representante" column, we can stop
        if (headerValue === 'correo representante') {
          foundCorreoPrestador = true;
          break;
        }
      } else if (colIndex > 5 && !headerValue) {
        // If we find an empty header after column 5, we can assume there are no more headers
        // unless we've just not reached "correo representante" yet
        if (!foundCorreoPrestador && colIndex < 96) {
          continue;
        } else {
          break;
        }
      }
    }

    // Process data rows
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const rowData = {};

        // Use headers as keys
        for (let colIndex = 1; colIndex <= maxColumn; colIndex++) {
          if (headers[colIndex - 1]) {
            const cellValue = row.getCell(colIndex).value;

            // Special handling for email columns
            if (headers[colIndex - 1] === 'correo representante' ||
              headers[colIndex - 1] === 'email') {
              rowData[headers[colIndex - 1]] = this.extractEmail(cellValue);
            } else {
              rowData[headers[colIndex - 1]] = cellValue?.toString() || '';
            }
          }
        }

        data.push(rowData);
      }
    });

    return data;
  }

  private async generate_Prestador_fiscalyear_services(prestadorFiscalyearInformation: PrestadorFiscalyearInformation, serviciosData: any[]): Promise<PrestadorFiscalyearServicios[]> {

    //get ids of servicios from serviciosData 
    const serviciosIds = serviciosData.map(servicio => servicio.serv_codigo);

    //search for all the servicio ids to use them in the prestador_fiscalyear_services
    const servicios = await this.servicioRepository.find({
      where: { code: In(serviciosIds) }
    });

    //we need to create a prestador_fiscalyear_services array for each row of the serviciosData
    const prestadorFiscalyearServices: PrestadorFiscalyearServicios[] = [];
    for (const row of serviciosData) {
      const rowNumber = serviciosData.indexOf(row);
      const prestadorFiscalyearService = new PrestadorFiscalyearServicios();
      prestadorFiscalyearService.prestador = prestadorFiscalyearInformation.prestador;
      prestadorFiscalyearService.fiscalYear = prestadorFiscalyearInformation.fiscalYear;

      // Find matching servicio
      const servicio = servicios.find(s => s.code === row.serv_codigo);
      if (servicio) {
        prestadorFiscalyearService.servicio = servicio;
      }
      else {
        throw new BadRequestException(
          [`Servicio no encontrado en la base de datos en la fila ${rowNumber + 1}`],
          {
            cause: new Error(),
            description: 'Servicio no encontrado en la base de datos',
          },
        );
      }

      prestadorFiscalyearService.complejidades = row.complejidades;
      prestadorFiscalyearService.state = generalStateTypes.ACTIVO;
      prestadorFiscalyearService.fecha_apertura = row.fecha_apertura;
      prestadorFiscalyearService.fecha_cierre = row.fecha_cierre;
      prestadorFiscalyearService.numero_sede_principal = row.numero_sede_principal;
      prestadorFiscalyearService.fecha_corte_REPS = row.fecha_corte_reps;
      prestadorFiscalyearService.horario_lunes = row.horario_lunes;
      prestadorFiscalyearService.horario_martes = row.horario_martes;
      prestadorFiscalyearService.horario_miercoles = row.horario_miercoles;
      prestadorFiscalyearService.horario_jueves = row.horario_jueves;
      prestadorFiscalyearService.horario_viernes = row.horario_viernes;
      prestadorFiscalyearService.horario_sabado = row.horario_sabado;
      prestadorFiscalyearService.horario_domingo = row.horario_domingo;
      prestadorFiscalyearService.modalidad_intramural = row.modalidad_intramural === 'SI';
      prestadorFiscalyearService.modalidad_extramural = row.modalidad_extramural === 'SI';
      prestadorFiscalyearService.modalidad_unidad_movil = row.modalidad_unidad_movil === 'SI';
      prestadorFiscalyearService.modalidad_domiciliario = row.modalidad_domiciliario === 'SI';
      prestadorFiscalyearService.modalidad_jornada_salud = row.modalidad_jornada_salud === 'SI';
      prestadorFiscalyearService.modalidad_telemedicina = row.modalidad_telemedicina === 'SI';
      prestadorFiscalyearService.modalidad_prestador_referencia = row.modalidad_prestador_referencia === 'SI';
      prestadorFiscalyearService.modalidad_prestador_referencia_telemedicina_interactiva = row.modalidad_prestador_referencia_telemedicina_interactiva === 'SI';
      prestadorFiscalyearService.modalidad_prestador_referencia_telemedicina_no_interactiva = row.modalidad_prestador_referencia_telemedicina_no_interactiva === 'SI';
      prestadorFiscalyearService.modalidad_prestador_referencia_tele_experticia = row.modalidad_prestador_referencia_tele_experticia === 'SI';
      prestadorFiscalyearService.modalidad_prestador_referencia_tele_monitoreo = row.modalidad_prestador_referencia_tele_monitoreo === 'SI';
      prestadorFiscalyearService.modalidad_prestador_remisor = row.modalidad_prestador_remisor === 'SI';
      prestadorFiscalyearService.modalidad_prestador_remisor_tele_experticia = row.modalidad_prestador_remisor_tele_experticia === 'SI';
      prestadorFiscalyearService.modalidad_prestador_remisor_tele_monitoreo = row.modalidad_prestador_remisor_tele_monitoreo === 'SI';

      prestadorFiscalyearServices.push(prestadorFiscalyearService);
    }

    return prestadorFiscalyearServices;
  }

  private async createPrestadorFiscalyearInformation(serviciosData: any, weekgroupVisit: WeekgroupVisit, weekgroupFiscalYear: FiscalYear): Promise<PrestadorFiscalyearInformation> {

    const prestadorFiscalyearInformation = new PrestadorFiscalyearInformation();

    // Set relations using the full objects
    prestadorFiscalyearInformation.prestador = weekgroupVisit.prestador;
    prestadorFiscalyearInformation.fiscalYear = weekgroupFiscalYear;

    //we need to search for the municipios where the serviciosData key muni_nombre its equals to municipios.name
    const municipio = await this.municipioRepository.findOne({
      where: { name: serviciosData.muni_nombre }
    });

    //if municipio dosnt wxist, we throw an error
    if (!municipio) {
      throw new BadRequestException('Municipio no encontrado en la base de datos');
    }

    prestadorFiscalyearInformation.municipio = municipio;
    prestadorFiscalyearInformation.nombre_prestador = serviciosData.nombre;
    prestadorFiscalyearInformation.telefonoPrestador = serviciosData.telefono;
    prestadorFiscalyearInformation.codigoSede = serviciosData.codigo_habilitacion;
    prestadorFiscalyearInformation.correoSede = serviciosData.email;
    prestadorFiscalyearInformation.correoPrestador = serviciosData.email;
    prestadorFiscalyearInformation.telefonoSede = serviciosData.telefono;
    prestadorFiscalyearInformation.direccionSede = serviciosData.direccion;
    prestadorFiscalyearInformation.nombreSede = serviciosData.sede_nombre;
    prestadorFiscalyearInformation.habi_codigo_habilitacion = serviciosData.habi_codigo_habilitacion;
    prestadorFiscalyearInformation.codigo_habilitacion = serviciosData.codigo_habilitacion;
    prestadorFiscalyearInformation.numero_sede = serviciosData.numero_sede;
    prestadorFiscalyearInformation.nits_nit = serviciosData.nits_nit;
    prestadorFiscalyearInformation.dv = serviciosData.dv;
    prestadorFiscalyearInformation.representante_legal = serviciosData['nombre_representante_legal'];

    // Extract email from potentially complex Excel object
    const emailRepresentante = this.extractEmail(serviciosData['correo_representante']);
    prestadorFiscalyearInformation.correoRepresentante = emailRepresentante;

    //validate prestadorFiscalyearInformation.correoRepresentante is not empty and its a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!prestadorFiscalyearInformation.correoRepresentante || !emailRegex.test(prestadorFiscalyearInformation.correoRepresentante)) {
      throw new BadRequestException(
        [`El correo del representante legal es requerido y debe ser un correo válido, ubicado en la columna con cabecera "correo_representante". Valor actual: ${prestadorFiscalyearInformation.correoRepresentante}`],
        {
          cause: new Error(),
          description: 'El correo del representante legal es requerido y debe ser un correo válido, ubicado en la columna con cabecera "correo_representante"',
        },
      );
    }

    return prestadorFiscalyearInformation;
  }

}