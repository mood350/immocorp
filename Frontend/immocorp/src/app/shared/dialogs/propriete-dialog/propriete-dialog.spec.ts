import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprieteDialog } from './propriete-dialog';

describe('ProprieteDialog', () => {
  let component: ProprieteDialog;
  let fixture: ComponentFixture<ProprieteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProprieteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProprieteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
