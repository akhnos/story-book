import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseURL = 'https://story-book-5f41e.hq.spicaengine.com/api';
  public language = 'TR';
  constructor(private http: HttpClient) {}

  getScenes() {
    return this.http.get(
      this.baseURL +
        `/bucket/5e7b36fc5679770ff79ef8f2/data?filter={"language":"${this.language}", "video_id":{"$ne":"menu"}}`,
      {}
    );
  }

  getMenu() {
    return this.http.get(
      this.baseURL +
        `/bucket/5e7b36fc5679770ff79ef8f2/data?filter={"video_id":"menu"}`,
      {}
    );
  }
}
