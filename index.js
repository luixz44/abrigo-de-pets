import express from 'express';

const app = express();
app.use(express.json());

let pets = [
  { idPet: 1, dsNome: "Rex", dsEspecie: "cachorro", nuIdade: 3, fgAdotado: false },
  { idPet: 2, dsNome: "Mimi", dsEspecie: "gato", nuIdade: 2, fgAdotado: false },
  { idPet: 3, dsNome: "Pipoca", dsEspecie: "coelho", nuIdade: 1, fgAdotado: false }
];
let ultimoId = 3;

function buscarTodosPets() {
  return pets;
}

function buscarPetPorId(id) {
  return pets.find(p => p.idPet === id);
}

function criarPet(dados) {
  ultimoId++;
  const novoPet = {
    idPet: ultimoId,
    dsNome: dados.dsNome,
    dsEspecie: dados.dsEspecie,
    nuIdade: dados.nuIdade,
    fgAdotado: false
  };
  pets.push(novoPet);
  return novoPet;
}

function atualizarPet(id, dados) {
  const pet = buscarPetPorId(id);
  if (!pet) return null;
  if (dados.dsNome !== undefined) pet.dsNome = dados.dsNome;
  if (dados.dsEspecie !== undefined) pet.dsEspecie = dados.dsEspecie;
  if (dados.nuIdade !== undefined) pet.nuIdade = dados.nuIdade;
  if (dados.fgAdotado !== undefined) pet.fgAdotado = dados.fgAdotado;
  return pet;
}

function deletarPet(id) {
  const index = pets.findIndex(p => p.idPet === id);
  if (index === -1) return false;
  pets.splice(index, 1);
  return true;
}

app.get('/pets', (req, res) => {
  res.status(200).json(buscarTodosPets());
});

app.get('/pets/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ mensagem: "identificador deve ser um numero" });
  }
  const pet = buscarPetPorId(id);
  if (!pet) {
    return res.status(404).send();
  }
  res.status(200).json(pet);
});

app.post('/pets', (req, res) => {
  const { dsNome, dsEspecie, nuIdade } = req.body;
  if (!dsNome || typeof dsNome !== 'string' || dsNome.trim() === '') {
    return res.status(400).json({ mensagem: "nome e obrigatorio" });
  }
  if (!dsEspecie || typeof dsEspecie !== 'string' || dsEspecie.trim() === '') {
    return res.status(400).json({ mensagem: "especie e obrigatoria" });
  }
  if (nuIdade === undefined || typeof nuIdade !== 'number' || nuIdade < 0) {
    return res.status(400).json({ mensagem: "idade invalida" });
  }
  const novoPet = criarPet({ dsNome, dsEspecie, nuIdade });
  res.status(201).json(novoPet);
});

app.patch('/pets/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ mensagem: "identificador deve ser um numero" });
  }
  const petExistente = buscarPetPorId(id);
  if (!petExistente) {
    return res.status(404).send();
  }
  const { dsNome, dsEspecie, nuIdade, fgAdotado } = req.body;
  if (dsNome === undefined && dsEspecie === undefined && nuIdade === undefined && fgAdotado === undefined) {
    return res.status(400).json({ mensagem: "nenhum campo valido para atualizar" });
  }
  if (dsNome !== undefined && (typeof dsNome !== 'string' || dsNome.trim() === '')) {
    return res.status(400).json({ mensagem: "nome invalido" });
  }
  if (dsEspecie !== undefined && (typeof dsEspecie !== 'string' || dsEspecie.trim() === '')) {
    return res.status(400).json({ mensagem: "especie invalida" });
  }
  if (nuIdade !== undefined && (typeof nuIdade !== 'number' || nuIdade < 0)) {
    return res.status(400).json({ mensagem: "idade invalida" });
  }
  if (fgAdotado !== undefined && typeof fgAdotado !== 'boolean') {
    return res.status(400).json({ mensagem: "status de adocao deve ser verdadeiro ou falso" });
  }
  const petAtualizado = atualizarPet(id, { dsNome, dsEspecie, nuIdade, fgAdotado });
  res.status(200).json(petAtualizado);
});

app.delete('/pets/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ mensagem: "identificador deve ser um numero" });
  }
  const deletado = deletarPet(id);
  if (!deletado) {
    return res.status(404).send();
  }
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});