export interface PlayerModel {
  photo: string;
  identification: string;
  gender: number;
  birthDate: Date;
  height: number;
  weight: number;
  state: string;
  town: string;
}

export interface ClubModel {
  name: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  youtube: string;
  website: string;
  logo: string;
}

export interface RefereeModel {
  photo: string;
  identification: string;
  gender: number;
  birthDate: Date;
  height: number;
  weight: number;
  state: string;
  town: string;
}

export interface SubModel {
  id: number;
  name: string;
  age: number;
}

export interface TeamModel {
  teamName: String;
  genderId: number;
  subId: number;
  coachName: String;
}

export interface GameModel {
  name: string;
  field: string
  gameDate: Date;
  gameTime: string;
  subId: number;
  refereeId: number;
}

export interface FieldModel { 
  name: string;
  phone: string;
  email: string;
  street: string;
  postalCode: string;
  municipality: string;
  town: string;
  state: string;
  capacity: number;
}