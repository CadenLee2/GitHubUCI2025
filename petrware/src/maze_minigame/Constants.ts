export const STUDENT_CENTER_FLOOR_2 = [
  "1111111111111111x22222222x3333333x44444444444444444x555555555555555555555",
  "1111111111111111x22222222x3333333x44444444444444444x555555555555555555555",
  "1111111111111111xSx222222x3333333x44444444444444444x555555555555555555xxx",
  "1111111111111111xSx222222x3333333x44444444444444444x555555555555555555x  ",
  "1111111111111111xxx222222xxDxxxxxx44444444444444444x5555555555555555xxx  ",
  "1111111111111111D222222222222xaaax4444444444444444x 55555555555555xSx    ",
  "1111111111111111x2222222xSxDxxaaaxxxxxxxxxxxxxxxxxxx55555555555555xSx    ",
  "1111111111111111x2222222xSxaaaaxax777777x8888888888x55555555555555x55xxxx",
  "1111111111111111xxxxxDxxxx9xaaaxax777777x8888888888xxx555555555555x555555",
  "xxxxx11111111111x9999999999xxxxxDx777777x888888888888x555555555xxxxxxxxxx",
  "99999xxxxxxxxDxxx9999999999999999x77xDx7x888888888888D55555555x6666666666",
  "9999999999999999999999999999999999xx999x9xx8888888888x55555555x6666666666",
  "9999999999999999999999999999999999999999999xx88888888x55555xxxx66666xxxxx",
  "999999999999999999999999999999999999999999999xxxDxxDDx5555x666666666x9999",
  "99999999xxDx99999999999999999999999999999999999999999x555x xxx666666D9999",
  "999999xx    xx9999999999999999999999999999999999999xSx555x   x666666x9999",
  "9999xx        xxxxxDxxxxxxx999999999999999999999999xSx555x   xxxxxxxx9999",
  "99xx          x            x999999999999999999999999xxDxxxxxxx99999999999",
  "xx            x             x99999999999999999999999999999999999999999999",
];

// 0         1         2         3         4         5         6         7         8
// 012345678901234567890123456789012345678901234567890123456789012345678901234567890
export const STUDENT_CENTER_FLOOR_1 = [
  "    x33333333333x4444444x55555555x66666666666666666xddddddddddddddddddddd",
  "xxxxx3333xxxxxxxxxx44444x55555555x66666666666666666xddddddddddddddddddddd",
  "1111x3333x222222xSx44444x55555555x66666666666666666xddddddddddddddxxxxxxx",
  "1111D3333D222222xSx44444x55555555x66666666666666666Dddddddddddddddxdddxbb",
  "1111x3333x222222x4444444x55555555x66666666666666666xddddddddddddddxdxxxbb",
  "1111D3333D222222x4444444xxxDxxxxxx6666666666666666xdddddddddddddddxSxbbbb",
  "1111x3333x222222x4444444xSx xx   xxxDDxxxxxDxxxxxxxxddddddddddddddxSxbbbb",
  "xxxx333333xxxxxxx4444444xSx  xxx x      x8888888888xdddddddddddddddddxxxx",
  "3333333333333333xxxxxDxxx      x x      x8888888888xxxddddddddddddddddddd",
  "xxxxx33333333333x                x      x888888888888xxxxxxddddxxxxxxxxxx",
  "     xxxxxxxxDxxx       xxDxxDxxDx      x888888888888x99999xddxcccx      ",
  "                        x77777777x       xx8888888888x99999xddxcccx      ",
  "                        xxDxxDxxDx         xx88888888D99999xxxxccccxxxxxx",
  "          xxx                                xx888888x9999xcccxcccccccccc",
  "        xxeeexDx                               xDxxDxx999xccccxxxxxxccccc",
  "      Dxeeeeeeeexxx                 xx             xSxDDDxccccxcccccccccc",
  "    xxeeeeeeeeeeeeexDx            xxffxxx          xSx   xccccxxxxxxccccc",
  "  xxeeeeeeeeeeeeeeeeeexxx       DDfffffffxxx             Dccccccccccccccc",
  "xxeeeeeeeeeeeeeeeeeeeeeeexDx  xxffffffffffffxxx          xccccccccccccccc",
];

export const ROOMS_2: Record<string, string> = {
  '1': 'West Food Court',
  '2': 'Student Center Lobby',
  '3': 'Crystal Cove Auditorium',
  '5': 'UCI Bookstore',
  '6': 'Starbucks',
  '7': 'Anthill Pub and Grill',
  '8': 'East Food Court',
  '9': 'Terrace',
  ' ': 'Esports Arena',
  'a': 'Restrooms'
}

export const ROOMS_1: Record<string, string> = {
  '1': 'Doheny Beach Meeting Rooms',
  '2': 'Emerald Bay Meeting Rooms',
  '3': 'Gallery Lounge',
  '4': 'Crystal Cove Lounge',
  '5': 'Crystal Cove Auditorium',
  '6': 'Empty Room',
  '7': 'Crescent Bay Rooms',
  '8': 'Computer Lab',
  '9': 'CSL Patio',
  'c': 'Courtyard Study Lounge',
  ' ': 'Hallway',
  'd': 'UCI Bookstore',
  'e': 'West Courtyard',
  'f': 'Pacific Ballroom'
};

export const ROOMS_2_QCOORDS: Record<string, { x: number, y: number }> = {
  '1': { x: 4, y: 5 },
  '2': { x: 21, y: 3 },
  '3': { x: 29, y: 1 },
  '5': { x: 56, y: 11 },
  '6': { x: 64, y: 13 },
  '7': { x: 37, y: 8 },
  '8': { x: 47, y: 9 },
  ' ': { x: 9, y: 17 },
  'a': { x: 29, y: 7 }
};

export const ROOMS_1_QCOORDS: Record<string, { x: number, y: number }> = {
  '1': { x: 2, y: 4 },
  '2': { x: 13, y: 4 },
  '3': { x: 7, y: 6 },
  '4': { x: 20, y: 5 },
  '5': { x: 28, y: 2 },
  '6': { x: 42, y: 3 },
  '7': { x: 29, y: 11 },
  '8': { x: 47, y: 10 },
  '9': { x: 56, y: 12 },
  'c': { x: 65, y: 17 },
  'd': { x: 59, y: 5 },
  'e': { x: 11, y: 16 },
  'f': { x: 37, y: 18 },
};
