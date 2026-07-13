import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-current-bets',
  templateUrl: './current-bets.component.html',
  styleUrls: ['./current-bets.component.css']
})
export class CurrentBetsComponent {
  @ViewChild('tabsContainer') tabsContainer!: ElementRef;

  userBets: any;
  exchange: any;
  selected: any = "Odds";
  expand: any;
  expandcheck = false;
  loading: boolean = true;
  activeTab = 0
  indicatorWidth: number = 0;
  indicatorPosition: number = 0;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  dropdownshow = false;
  currentBetsData: any;
  checkboxx = 'bt'
  selectTab = false;
  selectedOption = 'Matched';
  unmatchedtest = false
  isClassicTheme = false

  constructor(
    private location: Location,
    private dataServe: DataHandlerService, private meta: Meta
  ) { }
  goBack(): void {
    this.location.back();
  }
  normalWorking(dt: any) {
    this.checkboxx = dt;
  }

  setTab(tabIndex: number) {
    this.activeTab = tabIndex;
  }

  ngOnInit(): void {
     this.dataServe.changeTheme$.subscribe({
      next:(f) => this.isClassicTheme = f,
    })
    this.dataServe.getUserBets().subscribe((res: any) => {
      this.userBets = res;
      this.loading = false;
      this.exchange = this.userBets.filter((re: any) => {
        if (re.sourceBetType == "Odds" && re.type != "Parlay-Premium") {
          return re
        }
      })
    })

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing = this.jsonWeblinksdt?.validShowing;
    }
    this.currentBetsData = new FormGroup({
      resultType: new FormControl('Matched'),
    })
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.updateIndicatorPosition(this.selected);
    });
  }
  scrollActiveTabToCenter() {
    const activeTab: HTMLElement | null =
    this.tabsContainer.nativeElement.querySelector('.active');
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }
  updateIndicatorPosition(select: any) {
    const elementList = Array.from(document.querySelectorAll('#tab-container > li'));
    const selectedElement = elementList.find((el: any) =>
      el.innerText.trim().toLowerCase().includes(select.toLowerCase())
    );

    if (selectedElement) {
      const rect = selectedElement.getBoundingClientRect();
      const containerRect = document.querySelector('#tab-container')!.getBoundingClientRect();

      this.indicatorWidth = rect.width;
      this.indicatorPosition = rect.left - containerRect.left + 8;
    }
  }


  getAllBets(select: any) {
    this.updateIndicatorPosition(select);

    if (select == "Odds") {
      this.selected = "Odds"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.sourceBetType == "Odds" && re.type != "Parlay-Premium") {
          return re
        }
      })
    } else if (select == "BooKMaker") {
      this.selected = "BooKMaker"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.sourceBetType == "BooKMaker" && re.type != "Parlay-Premium") {
          return re
        }
      })
    } else if (select == "Fancy") {
      this.selected = "Fancy"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.sourceBetType == "Fancy" && re.type != "Parlay-Premium") {
          return re
        }
      })
    } else if (select == "Fancy1") {
      this.selected = "Fancy1"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.sourceBetType == "Fancy1" && re.type != "Parlay-Premium") {
          return re
        }
      })
    } else if (select == "Toss") {
      this.selected = "Toss"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.sourceBetType == "Toss" && re.type != "Parlay-Premium") {
          return re
        }
      })
    } else if (select == "Casino") {
      this.selected = "Casino"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.matchName == "AWC Casino" && re.type != "Parlay-Premium") {
          return re
        }
      })
    } else if (select == "Other") {
      this.selected = "Other"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.sourceBetType == "Other" && re.type != "Parlay-Premium") {
          return re
        }
      })
    } else if (select == "Sportsbook") {
      this.selected = "Sportsbook"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.sourceBetType == "Premium" && re.type != "Parlay-Premium") {
          return re
        }
      })
    } else if (select == "Saba") {
      this.selected = "Saba"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.matchName == "SABA SPORTS") {
          return re
        }
      })
    } else if (select == "Parlay") {
      this.selected = "Parlay"
      this.exchange = this.userBets.filter((re: any) => {
        if (re.type == "Parlay-Premium") {
          return re
        }
      })
    }

    setTimeout(() => {
      this.scrollActiveTabToCenter();
    });

  }




  details(i: any) {
    if (this.expandcheck == false) {
      this.expand = i;
      this.expandcheck = true;
    } else {
      this.expand = undefined;
      this.expandcheck = false;
    }
  }
  onDrop() {
    this.dropdownshow = !this.dropdownshow
  }
  onSelect(option: string) {
    this.currentBetsData.controls['resultType'].setValue(option);
    this.dropdownshow = false
  }

  toggleSelect() {
    this.selectTab = !this.selectTab;
  }
  selectOption(option: string) {
    this.selectedOption = option;
    this.selectTab = false;
    //  setTimeout(() => {
    //   this.loading = false
    //  }, 1000);
  }
  test() {
    this.unmatchedtest = !this.unmatchedtest;
  }
}
