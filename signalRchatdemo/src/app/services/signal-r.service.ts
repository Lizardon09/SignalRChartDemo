import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { ChartModel } from '../services/interfaces/chartmodel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private baseurl = "https://localhost:44321/"
  private charturl = "chart"

  public data: ChartModel[];
  public bradcastedData: ChartModel[];
 
  private hubConnection: signalR.HubConnection

  constructor(private http: HttpClient) { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(this.baseurl+this.charturl)
                            .build();
 
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
 
  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.data = data;
      console.log(data);
    });
  }

  public startHttpRequest = () => {
    this.http.get(this.baseurl+"api/"+this.charturl)
      .subscribe(res => {
        console.log(res);
      })
  }

  public broadcastChartData = () => {
    const data = this.data.map(m => {
      const temp = {
        data: m.data,
        label: m.label
      }
      return temp;
    });

    this.hubConnection.invoke('broadcastchartdata', data)
    .catch(err => console.error(err));
  }
 
  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
    })
  }

}
