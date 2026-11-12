// O que o cliente envia no corpo do POST e do PUT de treinador
export interface DadosTreinador {
  nome: string;
  cidade: string;
}

// O que o cliente envia para pôr um Pokémon no time: só o nome ou o número
export interface DadosNoTime {
  pokemon: string;
}
