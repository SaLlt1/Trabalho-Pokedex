// O Pokémon mascote do funcionário, com os dados que vieram da PokéAPI
export interface Pokemon {
  numero: number;        // número na Pokédex (o "id" da PokéAPI)
  nome: string;          // sempre em minúsculas, como a PokéAPI devolve
  tipos: string[];       // na ordem da PokéAPI, ex.: ["grass", "poison"]
  imagem: string | null; // endereço da imagem; alguns Pokémon não têm
}
