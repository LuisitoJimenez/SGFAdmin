import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/home/home.module').then((m) => m.HomeModule),
      }
    ]
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'players',
        loadChildren: () =>
          import('./modules/players/players.module').then((m) => m.PlayersModule),
      },
      {
        path: 'referees',
        loadChildren: () =>
          import('./modules/referees/referees.module').then((m) => m.RefereesModule),
      },
      {
        path: 'clubs',
        loadChildren: () =>
          import('./modules/clubs/clubs.module').then((m) => m.ClubsModule),
      },
      {
        path: 'teams',
        loadChildren: () =>
          import('./modules/teams/teams.module').then((m) => m.TeamsModule),
      },
      {
        path: 'games',
        loadChildren: () =>
          import('./modules/games/games.module').then((m) => m.GamesModule),
      },
      {
        path: 'statistics',
        loadChildren: () =>
          import('./modules/statistics/statistics.module').then((m) => m.StatisticsModule),
      },
      {
        path: 'tournaments',
        loadChildren: () =>
          import('./modules/tournaments/tournaments.module').then((m) => m.TournamentsModule),
      },
      {
        path: 'store',
        loadChildren: () =>
          import('./modules/store/store.module').then((m) => m.StoreModule),
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
