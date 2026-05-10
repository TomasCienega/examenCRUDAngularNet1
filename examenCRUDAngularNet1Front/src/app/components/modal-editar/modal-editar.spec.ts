import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditar } from './modal-editar';

describe('ModalEditar', () => {
  let component: ModalEditar;
  let fixture: ComponentFixture<ModalEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditar],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
