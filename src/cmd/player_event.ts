import * as mc from '@minecraft/server'
import {
  cmdorigin,
  srctype,
  statutype,
  cmdtype,
  perlvl,
  argtype,
  sys
} from 'type'

export let actiontype = ['climbing', 'emoting', 'falling', 'flying', 'gliding', 'in_water', 'jumping', 'on_ground', 'sleeping', 'sneaking', 'sprinting', 'swimming'];

export let player_event: cmdtype = {
  name: 'ac:player_event',
  description: '判断玩家的活动',
  permissionLevel: perlvl.GameDirectors,
  mandatoryParameters: [
    {
      name: 'player',
      type: argtype.PlayerSelector
    },
    {
      name: 'ac:action',
      type: argtype.Enum,
    }
  ],
  optionalParameters: [
    {
      name: 'true_block',
      type: argtype.Location
    },
    {
      name: 'false_block',
      type: argtype.Location
    },
    {
      name: "delay",
      type: argtype.Integer
    }
  ]
}

export function playereventfunc(o: cmdorigin, ps: mc.Player[], action: string, trueblock?: mc.Vector3, falseblock?: mc.Vector3, delay?: number) {
  let pos: mc.Vector3;
  let id: string;
  let d: mc.Dimension;
  if (o.sourceType == srctype.Entity) {
    pos = o.sourceEntity.location;
    id = o.sourceEntity.typeId;
    d = o.sourceEntity.dimension
  }
  else if (o.sourceType == srctype.Block) {
    pos = o.sourceBlock.location;
    id = o.sourceBlock.typeId;
    d = o.sourceBlock.dimension
  }
  else if (o.sourceType == srctype.NPCDialogue) {
    pos = o.sourceEntity.location;
    id = o.sourceEntity.typeId;
    d = o.sourceEntity.dimension
  }
  let flag: boolean;
  for (const p of ps) {
    switch (action) {
      case 'climbing':
        flag = p.isClimbing;
        break;
      case 'emoting':
        flag = p.isEmoting;
        break;
      case 'falling':
        flag = p.isFalling;
        break;
      case 'flying':
        flag = p.isFlying;
        break;
      case 'gliding':
        flag = p.isGliding;
        break;
      case 'in_water':
        flag = p.isInWater;
        break;
      case 'jumping':
        flag = p.isJumping;
        break;
      case 'on_ground':
        flag = p.isOnGround;
        break;
      case 'sleeping':
        flag = p.isSleeping;
        break;
      case 'sneaking':
        flag = p.isSneaking;
        break;
      case 'sprinting':
        flag = p.isSprinting;
        break;
      case 'swimming':
        flag = p.isSwimming;
        break;
    }
    if ((!trueblock) && (!falseblock)) return {
      status: (flag ? statutype.Success : statutype.Failure),
      message: `判断结果为${flag}`
    }
    else if (flag) {
      sys.run(() => {
        d.setBlockType(trueblock, 'redstone_block');
      });
      sys.runTimeout(() => {
        d.setBlockType(trueblock, 'air');
      }, delay ?? 1)
    }
    else if (falseblock) {
      sys.run(() => {
        d.setBlockType(falseblock, 'redstone_block')
      })
      sys.runTimeout(() => {
        d.setBlockType(falseblock, 'air')
      }, delay ?? 1)
    }
  }
  return {
    status: (flag ? statutype.Success : statutype.Failure),
    message: `判断结果为${flag}`
  }
}