import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}
  openSnackBar(message: string, success: boolean) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: success ? ['green-snackbar'] : ['red-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
