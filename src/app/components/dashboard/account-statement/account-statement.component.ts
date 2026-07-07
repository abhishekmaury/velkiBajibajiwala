import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent {

  constructor(private location: Location, private dataServe: DataHandlerService) { }

  accountStmt: any;
  currentPage = 1;
  loading: boolean = true;
  pages: number[] = [];
  totalPages = 0;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;

  ngOnInit(): void {

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing = this.jsonWeblinksdt?.validShowing;
    }
    this.dataServe.isLoggedIn();
    this.fetchPageData(this.currentPage);
  }

  fetchPageData(page: number): void {
    this.loading = true;
    this.dataServe.getAccountStmt(page).subscribe((res: any) => {
      this.accountStmt = res;
      this.totalPages = res.totalPages || 1;
      this.loading = false;

      this.updatePages();
    });
  }

  onPageClick(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPageData(page);
    }
  }

  addNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchPageData(this.currentPage);
    }
  }

  removeLastPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchPageData(this.currentPage);
    }
  }

  updatePages(): void {
    this.pages = [];
    const visiblePages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + visiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }
  goBack(): void {
    this.location.back();
  }
}
