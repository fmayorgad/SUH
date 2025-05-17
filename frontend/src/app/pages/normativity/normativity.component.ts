import { NgIf, NgFor } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { RouterLink, RouterOutlet } from "@angular/router"; 
import { CreateCriteriaDialogComponent } from "./dialog/create/create.dialog.component";

@Component({
	selector: "app-normativity-component",
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
	],
	templateUrl: "./normativity.component.html",
	styleUrl: "./normativity.component.scss",
})
export class NormativityComponent {
	constructor(public dialog: MatDialog) {}

	displayedColumns: string[] = [
		"index",
		"description",
		"type",
		"subgroup",
		"standard",
		"state",
		"actions",
	];
	dataSource = new MatTableDataSource<any>(ELEMENT_DATA);

	@ViewChild(MatPaginator) paginator: MatPaginator;

	openCreateDialog() {
		 const dialogRef = this.dialog.open(CreateCriteriaDialogComponent, {
		
		});
		dialogRef.afterClosed().subscribe((result) => {
			console.log(`Dialog result: ${result}`);
		});
	}

	openCompleteDialog(data: any): void {
		console.log('data :>> ', data);
		
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;

		console.log("weeks");
	}
}

const ELEMENT_DATA: any[] = [
	
	{
		index : '11.1.5.2',
		description : 'El prestador de servicios de salud realiza activididades en seguridad del paciente.',
		type : 'Específico',
		subgroup : 'Urgencias',
		standard : 'TALENTO HUMANO',
		state : true,
	},
	{
		index : '11.1.5.2',
		description : 'El prestador de servicios de salud cuenta con un comite o instancia que orienta y promueve la política de seguridad del paciente, el control de infecciones y la optimización del uso de antinbióticos...',
		type : 'Específico',
		subgroup : 'Urgencias',
		standard : 'TALENTO HUMANO',
		state : false,
	}
];
