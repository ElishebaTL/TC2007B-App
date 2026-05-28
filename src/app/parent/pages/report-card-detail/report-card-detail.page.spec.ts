import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportCardDetailPage } from './report-card-detail.page';

describe('ReportCardDetailPage', () => {
  let component: ReportCardDetailPage;
  let fixture: ComponentFixture<ReportCardDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCardDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
