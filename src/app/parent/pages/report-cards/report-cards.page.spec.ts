import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportCardsPage } from './report-cards.page';

describe('ReportCardsPage', () => {
  let component: ReportCardsPage;
  let fixture: ComponentFixture<ReportCardsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
