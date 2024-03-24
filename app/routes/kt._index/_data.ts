export type Weapon = {
  id: string;
  name: string;
  damage: number;
};

const Weapon1 = {
  id: "1",
  name: "Weapon1",
  damage: 3,
};
const Weapon2 = {
  id: "2",
  name: "Weapon2",
  damage: 3,
};
const Weapon3 = {
  id: "3",
  name: "Weapon3",
  damage: 3,
};
const Weapon4 = {
  id: "4",
  name: "Weapon4",
  damage: 3,
};

export type Unit = {
  id: string;
  pid: string;
  name: string;
  health: number;
  weapon: Weapon;
};
const Unit1 = {
  id: "p1u1",
  pid: "p1",
  name: "Unit1",
  health: 10,
  weapon: Weapon1,
};
const Unit2 = {
  id: "p1u2",
  pid: "p1",
  name: "Unit2",
  health: 10,
  weapon: Weapon2,
};
const Unit3 = {
  id: "p2u1",
  pid: "p2",
  name: "Unit3",
  health: 10,
  weapon: Weapon3,
};
const Unit4 = {
  id: "p2u2",
  pid: "p2",
  name: "Unit4",
  health: 10,
  weapon: Weapon4,
};

export type KT = {
  id: string;
  name: string;
  units: Unit[];
  points: number;
};
const Player1: KT = {
  id: "p1",
  name: "Player1",
  units: [Unit1, Unit2],
  points: 0,
};
const Player2: KT = {
  id: "p2",
  name: "Player2",
  units: [Unit3, Unit4],
  points: 0,
};

export const PLAYERS = [Player1, Player2];
