import { TestBed } from '@angular/core/testing';

import { ReportCard } from './report-card';

describe('ReportCard', () => {
  let service: ReportCard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportCard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
