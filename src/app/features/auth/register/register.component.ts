import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { PostComponent } from '../../../shared/components/post/post.component';
import { Post } from '../../../classes/post/post';
import { SelectModule } from 'primeng/select';
import { UserRole } from "../../../classes/user/user";
import { User } from '../../../classes/user/user';
import { demoContents, demoNames, demoUsernames } from '../../../shared/dummyContent/dummy-content';
import { RegisterFormComponent } from '../../../shared/components/register-form/register-form.component';
@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, PostComponent, RegisterFormComponent, SelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  demoUser: User = new User('0',
    demoNames[Math.floor(Math.random() * demoNames.length)],
    "federico1999g@gmail.com",
    demoUsernames[Math.floor(Math.random() * demoUsernames.length)],
    new Date(),
    'BIO!',
    'https://i.pravatar.cc/150',
    UserRole.USER,
    true,
    new Date()
  );

  demoPost: Post = new Post(
    '0',
    demoContents[Math.floor(Math.random() * demoContents.length)],
    'https://picsum.photos/640/480',
    Math.floor(Math.random() * (3200 - 5) + 5),
    Math.floor(Math.random() * (100 - 1) + 1),
    Math.floor(Math.random() * (50 - 1) + 1),
    true,
    true,
    new Date(),
    this.demoUser
  );
}
