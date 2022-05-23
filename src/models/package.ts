export interface Package {
  name: string;
  description: string;
  requiredDependencies: string[];
  optionalDependencies: string[];
  reverseDependenciess: string[];
}
