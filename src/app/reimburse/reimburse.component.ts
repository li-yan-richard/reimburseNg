import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { HttpClient, HttpEventType } from "@angular/common/http";
import { FileDetail } from '../fileDetail/fileDetail';

 // Maximum file size allowed to be uploaded = 100MB
 const MAX_SIZE: number = 100000000;

@Component({
  selector: 'app-reimburse',
  templateUrl: './reimburse.component.html',
  styleUrls: ['./reimburse.component.css']
})
export class ReimburseComponent implements OnInit {

  theFile: any;

  reimburseform = new FormGroup({
    PurchaseAmount: new FormControl('', Validators.maxLength(10)),
    PurchaseDate: new FormControl('', Validators.required),
    PurchaseDesc: new FormControl(),
   }); 
  public progress!: number;
  @Output() public onUploadFinished = new EventEmitter();
  public message!: string;

   constructor(private http: HttpClient) {};
      
  ngOnInit(): void {
  }

  onFormSubmit(): void {
    let file = new FileDetail();
    
    // Set File Information
    file.fileName = this.theFile.name;
    file.fileSize = this.theFile.size;
    file.fileType = this.theFile.type;
    file.lastModifiedTime = this.theFile.lastModified;
    file.lastModifiedDate = this.theFile.lastModifiedDate;
    
    // Use FileReader() object to get file to upload
    // NOTE: FileReader only works with newer browsers
    let reader = new FileReader();
    
    // Setup onload event for reader
    reader.onload = () => {
        // Store base64 encoded representation of file
        file.fileAsBase64 = reader.result!.toString();

        const formData = new FormData();
        formData.append('PurchaseAmount', this.reimburseform.get('PurchaseAmount')?.value);
        formData.append('PurchaseDate', this.reimburseform.get('PurchaseDate')?.value);
        formData.append('PurchaseDesc', this.reimburseform.get('PurchaseDesc')?.value);
        formData.append('file', this.theFile, this.theFile.name);

        this.http.post('http://localhost:5000/api/reimburse', formData, {reportProgress: true, observe: 'events'})
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded / MAX_SIZE);
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            this.onUploadFinished.emit(event.body);
          }
        });
    }
    
    reader.readAsDataURL(this.theFile);
  }  

  onFileChange(event) {
    this.theFile = null;
    if (event.target.files && event.target.files.length > 0) {
        // Don't allow file sizes over 100MB
        if (event.target.files[0].size < MAX_SIZE) {
            // Set theFile property
            this.theFile = event.target.files[0];
        }
        else {
            // Display error message
            alert("File: " + event.target.files[0].name + " is too large to upload.");
        }
    }
  }
}