import { NgIf } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { RouterLink, RouterOutlet } from "@angular/router";
import {ViewVisitDocumentComponent} from './view/view.dialog.component';
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "app-visitdocument",
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink,
		MatCardModule,
		MatButtonModule,
		MatMenuModule,
		MatPaginatorModule,
		MatTableModule,
		MatIconModule,
		NgIf,
	],
	templateUrl: "./visitdocument.component.html",
	styleUrl: "./visitdocument.component.scss",
})
export class VisitdocumentComponent {
	constructor(public dialog: MatDialog) {}

	displayedColumns: string[] = [
		"prestador",
		"visitdate",
		"lead",
		"state",
		"email",
		"actions",
	];
	dataSource = new MatTableDataSource<any>(ELEMENT_DATA);

	openCompleteDialog(data: any): void {
		console.log('data :>> ', data);
		const dialogRef = this.dialog.open(ViewVisitDocumentComponent, {
			data,
		});
		dialogRef.afterClosed().subscribe((result) => {
			console.log(`Dialog result: ${result}`);
		});
	}

	@ViewChild(MatPaginator) paginator: MatPaginator;

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		console.log("weeks");
	}
}

const ELEMENT_DATA: any[] = [
	{
		prestador:  "VANESSA HERNANDEZ BENITEZ",
		visitdate: "2024/10/05", 
		lead: "Fabio Mayorga" ,
		 state: {
			name: 'approved',
		}, 
		email: "vanessa_hernandez4@hotmail.com" ,
		actions: "" ,
		observations: "N/A",
	},

	
];
