export interface Seeder {
  seed(): Promise<void>
  drop(): Promise<void>
}