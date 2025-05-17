import { NgIf, NgFor } from "@angular/common";
import { Component, InjectionToken, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { RouterLink, RouterOutlet, ActivatedRoute } from "@angular/router";
import { CreateVisitGroupDialogComponent } from "./dialog/create/createvisitgroup.weekgroup.dialog.component";
import { CompleteVisitGroupDialogComponent } from "./dialog/complete/completevisitgroup.weekgroup.dialog.component";
import { WeekGroupsService } from "@services/weekgroups.service";
import { SnackbarService } from "@shared/snackmessage/snackmessage.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { WeekGroupPrestador } from "@interfaces/week-group-prestador.interface";
import { Member } from "@interfaces/member.interface";
import { WeekGroupUser } from "@interfaces/week-group-user.interface";
import { WeekGroupData } from "@interfaces/week-group-data.interface";
import { MatIconModule } from "@angular/material/icon";
import { DatePipe } from "@angular/common";
import {
	EcoFabSpeedDialComponent,
	EcoFabSpeedDialTriggerComponent,
	EcoFabSpeedDialActionsComponent,
} from "@ecodev/fab-speed-dial";
import { CreateditWeekGrupoDialogComponent } from '@pages/weeks/create/dialogs/create.weekgroup.dialog.components'
import { VeilComponent } from "@shared/veil/veil.component";
import { WeekgroupVisitsService } from "@services/weekgroup-visits.service";
import { VisitTypesEnum } from "@enums/visit-types.enum";

@Component({
	selector: "app-week-group-detail",
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink,
		MatCardModule,
		MatButtonModule,
		MatMenuModule,
		MatPaginatorModule,
		MatTooltipModule,
		MatTableModule,
		NgIf,
		NgFor,
		MatProgressSpinnerModule,
		MatIconModule,
		DatePipe,
		EcoFabSpeedDialComponent,
		EcoFabSpeedDialTriggerComponent,
		EcoFabSpeedDialActionsComponent,
		VeilComponent
	],
	templateUrl: "./weekgroupdetail.component.html",
	styleUrl: "./weekgroupdetail.component.scss",
})
export class WeekGroupDetailComponent {
	constructor(
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private weekGroupsService: WeekGroupsService,
		private weekgroupVisitsService: WeekgroupVisitsService,
		private snackmessage: SnackbarService,
	) { }

	displayedColumns: string[] = [
		"actions",
		"prestador",
		"prestadorCode",
		"lead",
		"state",
		"visitDate",
	];

	visitsDisplayedColumns: string[] = [
		"acciones",
		"prestador",
		"estado",
		"tipo",
		"fecha",
		"lider"
	];

	dataSource = new MatTableDataSource<any>([]);
	visitsDataSource = new MatTableDataSource<any>([]);

	loading = false;
	gettingData = false;
	loadingVisits = false;

	weekGroupData: WeekGroupData | null = null;
	groupMembers: Member[] = [];

	completedVisitsCount: number = 0;

	@ViewChild('groupPaginator') paginator: MatPaginator;
	@ViewChild('visitsPaginator') visitsPaginator: MatPaginator;

	getHeight(e: any): number {
		return e.offsetHeight;
	}

	async openEditDialog() {
		const dataToSend = {
			name: this.weekGroupData?.name || '',
			description: this.weekGroupData?.description || '',
			lead: this.weekGroupData?.leadData || '',
			members: this.weekGroupData?.weekgroupusers.map((e: any) => e.members) || '',
			selectedPrestadores: this.weekGroupData?.weekgroupprestadores.map((e: any) => ({
				...e.prestadores,
				weekGroupAgendaState: e.visits?.visitState || null
			})) || ''
		}

		console.log('dataToSend :>> ', dataToSend);

		const dialogRef = this.dialog.open(CreateditWeekGrupoDialogComponent, {
			data: { data: dataToSend, message: 'Puedes eliminar un prestador con una Visita Agendada pero NO si está COMPLETADA, debído a que al completar se envía el Comunicado de Visita al Prestador.' },
		});
		dialogRef.afterClosed().subscribe(async (result) => {
			if (result) {
				console.log('result :>> ', result);
				const payload: any = {
					name: result.name,
					description: result.description,
					lead: result.lead.id,
				};

				// Compare members and only include if changed
				const currentMembers = this.weekGroupData?.weekgroupusers.map(e => e.members.id) || [];
				const newMembers = result.members?.map((e: any) => e.id) || [];
				const membersChanged = !(new Set(currentMembers).size === new Set(newMembers).size &&
					[...new Set(currentMembers)].every(id => new Set(newMembers).has(id)));
				if (membersChanged) {
					payload.members = newMembers;
				}

				// Compare prestadores and only include if changed  
				const currentPrestadores = this.weekGroupData?.weekgroupprestadores.map(e => e.prestadores.id) || [];
				const newPrestadores = result.selectedPrestadores?.map((e: any) => e.id) || [];
				const prestadoresChanged = !(new Set(currentPrestadores).size === new Set(newPrestadores).size &&
					[...new Set(currentPrestadores)].every(id => new Set(newPrestadores).has(id)));
				if (prestadoresChanged) {
					payload.selectedPrestadores = newPrestadores;
				}

				this.gettingData = true;

				const request = await this.weekGroupsService.updateWeekGroup(this.weekGroupData?.id || '', payload);
				if (request.ok) {
					this.snackmessage.show({
						type: 'simple',
						title: 'Success',
						message: 'Grupo de semana actualizado correctamente',
						severity: 'success'
					});
					await this.getWeekGroupById();
				}
				this.gettingData = false;
			}
		});
	}

	openCreateDialog(element: any, isEdit: boolean = false): void {
		console.log('element :>> ', element);
		const dialogRef = this.dialog.open(CreateVisitGroupDialogComponent, {
			data: {
				weekgroup: this.weekGroupData,
				prestador: element.prestador,
				isEdit: isEdit,
				visitData: isEdit ? element : null
			}
		});
		dialogRef.afterClosed().subscribe(async (result) => {
			if (result && result.ok) {
				this.snackmessage.show({
					type: 'simple',
					title: 'Éxito',
					message: isEdit ? 'Visita actualizada correctamente' : 'Visita agendada correctamente',
					severity: 'success'
				});
				// Refresh the weekgroup data to show the new visit
				await this.getWeekGroupById();
			}
		});
	}

	openCompleteDialog(data: any): void {
		console.log('data :>> ', data);
		const dialogRef = this.dialog.open(CompleteVisitGroupDialogComponent, {
			data: {
				weekgroup: this.weekGroupData,
				prestador: data.prestador,
				visit: data.visit
			},
		});
		dialogRef.afterClosed().subscribe(async (result) => {
			
			if (result && result.ok) {
				await this.getWeekGroupById();
			}
		});
	}

	async ngAfterViewInit() {
		// Wait for the view to be fully initialized before setting the paginators
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
			// The visits paginator will be set in getVisitsByWeekgroupId
		});
		await this.getWeekGroupById();
	}

	async getWeekGroupById() {

		try {
			this.gettingData = true;
			const id = this.route.snapshot.params['id'];
			const request = await this.weekGroupsService.getWeekGroupById(id);

			if (request.ok) {
				this.weekGroupData = request;
				// Process the data for the table
				const tableData = request.weekgroupprestadores.map((item: WeekGroupPrestador) => ({
					id: item.id,
					prestador: {
						name: item.prestadores.nombreSede,
						code: item.prestadores.codigoPrestador,
						weekgroupState: item.weekgroupState,
						id: item.prestadores.id
					},
					lead: item?.visits?.lead ? {
						name: item?.visits?.lead?.name || null,
						lastname: item?.visits?.lead?.lastname || null,	
						surname: item?.visits?.lead?.surname || null,
						email: item?.visits?.lead?.email || null,
						phone: item?.visits?.lead?.phone || null,
						photo: null,
						role: "Contratista"
					} : null,
					varificators: request.weekgroupusers.map((user: WeekGroupUser) => ({
						name: user.members.name || '',
						lastname: user.members.lastname || user.members.surname || '',
						surname: user.members.surname || '',
						email: user.members.email || '',
						phone: user.members.phone || '',
						photo: null,
						role: "Contratista"
					})),
					visit: item.visits as unknown as any,
					visitDate: new Date().getTime()
				}));

				console.log('tableData :>> ', tableData);

				this.dataSource.data = tableData;
				// Make sure to set the paginator after updating the data
				if (this.paginator) {
					this.dataSource.paginator = this.paginator;
				}
				
				this.groupMembers = request.weekgroupusers.map((user: WeekGroupUser) => user.members);

				// Calculate completed visits
				this.completedVisitsCount = Array.isArray(request.weekgroupprestadores)
					? request.weekgroupprestadores.filter((item: any) => item.visits?.visitState === 'COMPLETADA').length
					: 0;

				// After getting weekgroup data, fetch visits for this weekgroup
				await this.getVisitsByWeekgroupId(id);
			}
			else {
				this.snackmessage.show({
					type: 'simple',
					title: 'Error',
					message: request.description,
					severity: 'error',
				});
			}
		}
		catch (error) {
			console.error('Error fetching weekgroup:', error);
			this.snackmessage.show({
				type: 'simple',
				title: 'Error',
				message: 'Error al obtener el grupo de semana. Por favor, inténtelo de nuevo.',
				severity: 'error',
			});
		} finally {
			this.gettingData = false;
		}
	}

	/**
	 * Fetches all visits associated with the current weekgroup ID
	 */
	async getVisitsByWeekgroupId(weekgroupId: string) {
		this.loadingVisits = true;
		try {
			const response = await this.weekgroupVisitsService.getVisitsByWeekgroupId(weekgroupId);

			if (response.ok) {

				console.log('response :>> ', response);
				// Transform the data for display
				const visitsData = response ? response.map((visit: any) => ({
					id: visit.id,
					prestador: visit.prestador ? {
						name: visit.prestador.nombreSede || 'Sin nombre',
						code: visit.prestador.codigoPrestador || 'Sin código'
					} : { name: 'No asignado', code: 'N/A' },
					tipo: visit.visitType,
					fecha: visit.visitDate,
					estado: visit.state,
					lider: visit.lead ? {
						name: visit.lead.name || '',
						lastname: visit.lead.lastname || '',
						surname: visit.lead.surname || ''
					} : { name: 'No asignado', lastname: '', surname: '' },
					descripcion: visit.description || 'Sin descripción',
					notas: visit.notes || '',
					weekgroup: visit.weekgroup,
					visit_state: visit.visitState,
					visit
				})) : [];

				console.log('visitsData :>> ', visitsData);

				this.visitsDataSource = new MatTableDataSource(visitsData);
				// Make sure to set the paginator for the visits data source
				if (this.visitsPaginator) {
					this.visitsDataSource.paginator = this.visitsPaginator;
				} else {
					// If paginator isn't available yet, try again after a short delay
					setTimeout(() => {
						if (this.visitsPaginator) {
							this.visitsDataSource.paginator = this.visitsPaginator;
						}
					}, 0);
				}
			} else {
				this.snackmessage.show({
					type: 'simple',
					title: 'Error',
					message: response.description || 'Error al obtener las visitas',
					severity: 'error',
				});
			}
		} catch (error) {
			console.error('Error fetching visits:', error);
			this.snackmessage.show({
				type: 'simple',
				title: 'Error',
				message: 'Error al obtener las visitas. Por favor, inténtelo de nuevo.',
				severity: 'error',
			});
		} finally {
			this.loadingVisits = false;
		}
	}

	/**
	 * Gets the human-readable name for a visit type
	 */
	getVisitTypeName(type: string): string {
		switch (type) {
			case VisitTypesEnum.PROGRAMACION:
				return 'Programación';
			case VisitTypesEnum.CERTIFICACION:
				return 'Certificación';
			default:
				return type;
		}
	}

}
