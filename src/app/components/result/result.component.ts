import { Component, Input } from '@angular/core';
import { GithubUser } from 'src/app/github/github.interface';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  @Input({ required: true }) githubUser!: GithubUser;
}
