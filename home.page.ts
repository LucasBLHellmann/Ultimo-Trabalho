import { Component, OnInit, OnDestroy } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  isActive = false;
  sensitivity = 2.5;
  currentAcceleration = { x: 0, y: 0, z: 0 };
  private accListener: any;

  constructor(private alertController: AlertController) {}

  async ngOnInit() {
    await Motion.requestPermissions();
  }

  toggleAlarm() {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.startMonitoring();
    } else {
      this.stopMonitoring();
    }
  }

  private startMonitoring() {
    this.accListener = Motion.addListener('accel', (event) => {
      this.currentAcceleration = event.acceleration;
      
      const totalAcc = Math.sqrt(
        event.acceleration.x ** 2 + 
        event.acceleration.y ** 2 + 
        event.acceleration.z ** 2
      );
      
      if (totalAcc < this.sensitivity * 0.4) {
        this.triggerAlarm('Queda detectada!');
        return;
      }
      
      const tiltAngle = this.calculateTiltAngle(
        event.acceleration.x, 
        event.acceleration.y
      );
      
      if (Math.abs(tiltAngle) > this.sensitivity * 15) {
        this.triggerAlarm(`Inclinação excessiva: ${tiltAngle.toFixed(1)}°`);
      }
    });
  }

  private calculateTiltAngle(x: number, y: number): number {
    return Math.atan2(y, x) * (180 / Math.PI);
  }

  private async triggerAlarm(message: string) {
    navigator.vibrate([200, 100, 200]);
    
    const alert = await this.alertController.create({
      header: 'Alarme',
      message: message,
      buttons: ['OK']
    });
    
    await alert.present();
    this.stopMonitoring();
  }

  private stopMonitoring() {
    if (this.accListener) {
      this.accListener.remove();
    }
  }

  ngOnDestroy() {
    this.stopMonitoring();
  }
}