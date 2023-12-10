export interface CardModel {
  title: string;
  subtitle: string;
  image: string;
  labels: string[];
  values: value[];
  showLabels: boolean;
  showImage: boolean;
}

export interface value {
  element: string;
}
