import { TestBed, async } from '@angular/core/testing';
import { InsightsAppComponent } from './insights.component';

describe('InsightsAppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InsightsAppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(InsightsAppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'PlatformUI3'`, () => {
    const fixture = TestBed.createComponent(InsightsAppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('PlatformUI3');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(InsightsAppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to PlatformUI3!');
  });
});
