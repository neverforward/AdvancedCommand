/**
 * _ooOoo_
 * o8888888o
 * 88" . "88
 * (| -_- |)
 *  O\ = /O
 * ___/`---'\____
 * .   ' \\| |// `.
 * / \\||| : |||// \
 * / _||||| -:- |||||- \
 * | | \\\ - /// | |
 * | \_| ''\---/'' | |
 * \ .-\__ `-` ___/-. /
 * ___`. .' /--.--\ `. . __
 * ."" '< `.___\_<|>_/___.' >'"".
 * | | : `- \`.;`\ _ /`;.`/ - ` : | |
 * \ \ `-. \_ __\ /__ _/ .-` / /
 * ======`-.____`-.___\_____/___.-`____.-'======
 * `=---='
 *          .............................................
 *           佛曰：bug泛滥，我已瘫痪！
 */

import * as mc from '@minecraft/server';
import * as mcdbg from '@minecraft/debug-utilities';
import { health } from 'cmd/health';
import { permissions } from 'permissions';

type returnType = string | { name: string; args?: string[] };
type fmt_type = { stat: boolean, str: string, raw: mc.RawMessage[] };

export function highlight_json(json: any, isKey = false): string {
  if (isKey) {
    return `§b${json}§r`;
  }

  switch (typeof json) {
    case 'string':
      return `§a"${json}"§r`;
    case 'number':
      return `§6${json}§r`;
    case 'boolean':
      return `§6${json}§r`;
    case 'object':
      if (json === null) {
        return 'null';
      }
      if (Array.isArray(json)) {
        const elements = json.map(item => highlight_json(item));
        return `[${elements.join(', ')}]`;
      } else {
        const entries = Object.entries(json).map(([key, value]: [string, any]) => {
          const coloredKey = highlight_json(key, true);
          const coloredValue = highlight_json(value);
          return `${coloredKey}: ${coloredValue}`;
        });
        return `{${entries.join(', ')}}`;
      }
    default:
      return json;
  }
}

function match(str: string): returnType[] {
  const result: returnType[] = [];
  let currentText = '';
  let i = 0;

  while (i < str.length) {
    if (str[i] === '[') {
      if (currentText) {
        result.push(currentText);
        currentText = '';
      }

      const endIndex = str.indexOf(']', i);
      if (endIndex === -1) {
        currentText += str[i];
        i++;
        continue;
      }

      const paramContent = str.slice(i + 1, endIndex);
      const parts = paramContent.split(',').map(p => p.trim());

      if (parts.length === 0) {
        i = endIndex + 1;
        continue;
      }

      const name = parts[0];
      const args = parts.slice(1).map(arg => arg);

      if (args.length > 0) {
        result.push({ name, args });
      } else {
        result.push({ name });
      }

      i = endIndex + 1;
    } else {
      currentText += str[i];
      i++;
    }
  }
  if (currentText) {
    result.push(currentText);
  }

  return result;
}
function fmt_p(p: mc.Player, name: string, args: string[]): fmt_type {
  let str = '';
  let stat = true;
  const raw: mc.RawMessage[] = [];
  let data_player = {
    // 名称
    name: p.name,
    nameTag: p.nameTag,

    // 生命值
    health: p.getComponent("health").currentValue,
    healthDefault: p.getComponent("health").defaultValue,
    healthMax: p.getComponent("health").effectiveMax,
    healthMin: p.getComponent("health").effectiveMin,

    // 位置
    x: p.location.x,
    y: p.location.y,
    z: p.location.z,

    // 维度
    dimension: p.dimension.localizationKey,
    dimensionWithoutLoc: function (
      overworld: string,
      nether: string,
      end: string,
    ) {
      switch (p.dimension.id) {
        case "minecraft:overworld":
          return overworld;
        case "minecraft:the_nether":
          return nether;
        case "minecraft:the_end":
          return end;
        default:
          return "未知";
      }
    },
    dimensionId: p.dimension.id,
    dimensionHeightRange: p.dimension.heightRange,

    // 图形模式
    graphicsMode: function () {
      switch (p.graphicsMode) {
        case mc.GraphicsMode.Simple:
          return 'options.graphicsMode.simple';
        case mc.GraphicsMode.Fancy:
          return 'options.graphicsMode.fancy';
        case mc.GraphicsMode.RayTraced:
          return 'options.graphicsMode.rayTraced'
        case mc.GraphicsMode.Deferred:
          return 'options.graphicsModeOptions.deferred';
      }
    },
    graphicsModeWithoutLoc: function (
      deferred: string,                       // 延迟渲染
      fancy: string,                          // 华丽
      rayTraced: string,                      // 光线追踪
      Simple: string,                        // 简单
    ) {
      switch (p.graphicsMode) {
        case mc.GraphicsMode.Deferred:
          return deferred;
        case mc.GraphicsMode.Fancy:
          return fancy;
        case mc.GraphicsMode.RayTraced:
          return rayTraced;
        case mc.GraphicsMode.Simple:
          return Simple;
        default:
          return "未知";
      }
    },

    // 输入信息
    imputMode: function () {
      switch (p.inputInfo.lastInputModeUsed) {
        case mc.InputMode.Gamepad:
          return 'options.controller';
        case mc.InputMode.KeyboardAndMouse:
          return 'options.keyboardAndMouse';
        case mc.InputMode.MotionController:
          return 'options.group.vr';
        case mc.InputMode.Touch:
          return 'options.touch';
        default:
      }
    },
    inputModeWithoutLoc: function (
      gamePad: string,                        // 游戏手柄
      keyboard: string,                       // 键盘
      VR: string,                             // VR
      touch: string                           // 触摸
    ) {
      switch (p.inputInfo.lastInputModeUsed) {
        case mc.InputMode.Gamepad:
          return gamePad;
        case mc.InputMode.KeyboardAndMouse:
          return keyboard;
        case mc.InputMode.MotionController:
          return VR;
        case mc.InputMode.Touch:
          return touch;
        default:
          return "未知";
      }
    },

    // 行为
    behavior: function (
      climb: string,                          // 攀爬
      emote: string,                          // 发送表情
      fall: string,                           // 跌倒
      fly: string,                            // 飞行
      gliding: string,                        // 摔跤
      inWater: string,                        // 水中
      jump: string,                           // 跳跃
      onGround: string,                       // 在地上
      sleep: string,                          // 睡眠
      sneak: string,                          // 潜行
      srpint: string,                         // 爬行
      swim: string                            // 游泳
    ) {
      let result = "";
      if (p.isClimbing) result += climb + ' ';
      if (p.isEmoting) result += emote + ' ';
      if (p.isFalling) result += fall + ' ';
      if (p.isFlying) result += fly + ' ';
      if (p.isGliding) result += gliding + ' ';
      if (p.isInWater) result += inWater + ' ';
      if (p.isJumping) result += jump + ' ';
      if (p.isOnGround) result += onGround + ' ';
      if (p.isSleeping) result += sleep + ' ';
      if (p.isSneaking) result += sneak + ' ';
      if (p.isSprinting) result += srpint + ' ';
      if (p.isSwimming) result += swim + ' ';
      return result;
    },

    // 经验等级
    level: p.level,

    // 权限等级
    permissionLevel: function () {
      switch (p.playerPermissionLevel) {
        case mc.PlayerPermissionLevel.Visitor:
          return 'permissions.level.visitor'
        case mc.PlayerPermissionLevel.Member:
          return 'permissions.level.member';
        case mc.PlayerPermissionLevel.Operator:
          return 'permissions.level.operator'
        case mc.PlayerPermissionLevel.Custom:
          return 'permissions.level.custom'
      }
    },
    permissionLevelWithoutLoc: function (
      visitor: string,                        // 游客
      member: string,                         // 成员
      op: string,                             // 操作员
      custom: string,                         // 自定义
    ) {
      switch (p.playerPermissionLevel) {
        case mc.PlayerPermissionLevel.Visitor:
          return visitor;
        case mc.PlayerPermissionLevel.Member:
          return member;
        case mc.PlayerPermissionLevel.Operator:
          return op;
        case mc.PlayerPermissionLevel.Custom:
          return custom;
        default:
          return "未知";
      }
    },

    // 选择槽位
    selectedSlotIndex: p.selectedSlotIndex,

    // 游戏模式
    gameMode: function () {
      switch (p.getGameMode()) {
        case mc.GameMode.Creative:
          return 'gameMode.creative';
        case mc.GameMode.Survival:
          return 'gameMode.survival';
        case mc.GameMode.Adventure:
          return 'gameMode.adventure';
        case mc.GameMode.Spectator:
          return 'gameMode.spectator'
      }
    },
    gameModeWithoutLoc: function (
      creative: string,                        // 创造模式
      survival: string,                       // 生存模式
      adventure: string,                      // 冒险模式
      spectator: string,                      // 观察模式
    ) {
      switch (p.getGameMode()) {
        case mc.GameMode.Creative:
          return creative;
        case mc.GameMode.Survival:
          return survival;
        case mc.GameMode.Adventure:
          return adventure;
        case mc.GameMode.Spectator:
          return spectator;
        default:
          return "未知";
      }
    }
  }

  switch (name) {
    case 'name':
      raw.push({ text: data_player.name });
      str += data_player.name;
      break;
    case 'nameTag':
      raw.push({ text: data_player.nameTag });
      str += data_player.nameTag;
      break;
    case 'health':
      raw.push({ text: data_player.health.toString() });
      str += data_player.health.toString();
      break;
    case 'healthDefault':
      raw.push({ text: data_player.healthDefault.toString() });
      str += data_player.healthDefault.toString();
      break;
    case 'healthMax':
      raw.push({ text: data_player.healthMax.toString() });
      str += data_player.healthMax.toString();
      break;
    case 'healthMin':
      raw.push({ text: data_player.healthMin.toString() });
      str += data_player.healthMin.toString();
      break;
    case 'x':
      raw.push({ text: data_player.x.toString() });
      str += data_player.x.toString();
      break;
    case 'y':
      raw.push({ text: data_player.y.toString() });
      str += data_player.y.toString();
      break;
    case 'z':
      raw.push({ text: data_player.z.toString() });
      str += data_player.z.toString();
      break;
    case 'dimension':
      raw.push({ translate: data_player.dimension });
      str += '[不支持]';
      break;
    case 'dimensionWithoutLoc':
      if (args.length < 3) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_player.dimensionWithoutLoc(args[0], args[1], args[2]) });
      str += data_player.dimensionWithoutLoc(args[0], args[1], args[2]);
      break;
    case 'dimensionId':
      raw.push({ text: data_player.dimensionId });
      str += data_player.dimensionId;
      break;
    case 'dimensionHeightRange':
      raw.push({ text: data_player.dimensionHeightRange.toString() });
      str += data_player.dimensionHeightRange.toString();
      break;
    case 'graphicsModeWithoutLoc':
      if (args.length < 4) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_player.graphicsModeWithoutLoc(args[0], args[1], args[2], args[3]) });
      str += data_player.graphicsModeWithoutLoc(args[0], args[1], args[2], args[3]);
      break;
    case 'graphicsMode':
      raw.push({ translate: data_player.graphicsMode() });
      str += '[不支持]';
      break;
    case 'inputModeWithoutLoc':
      if (args.length < 4) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_player.inputModeWithoutLoc(args[0], args[1], args[2], args[3]) });
      str += data_player.inputModeWithoutLoc(args[0], args[1], args[2], args[3]);
      break;
    case 'inputMode':
      raw.push({ translate: data_player.imputMode() });
      str += '[不支持]';
      break;
    case 'behavior':
      if (args.length < 12) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_player.behavior(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]) });
      str += data_player.behavior(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]);
      break;
    case 'level':
      raw.push({ text: data_player.level.toString() });
      str += data_player.level.toString();
      break;
    case 'permissionLevelWithoutLoc':
      if (args.length < 4) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_player.permissionLevelWithoutLoc(args[0], args[1], args[2], args[3]) });
      str += data_player.permissionLevelWithoutLoc(args[0], args[1], args[2], args[3]);
      break;
    case 'permissionLevel':
      raw.push({ translate: data_player.permissionLevel() });
      str += '[不支持]';
      break;
    case 'selectedSlotIndex':
      raw.push({ text: data_player.selectedSlotIndex.toString() });
      str += data_player.selectedSlotIndex.toString();
      break;
    case 'gameModeWithoutLoc':
      if (args.length < 4) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_player.gameModeWithoutLoc(args[0], args[1], args[2], args[3]) });
      str += data_player.gameModeWithoutLoc(args[0], args[1], args[2], args[3]);
      break;
    case 'gameMode':
      raw.push({ translate: data_player.gameMode() });
      str += '[不支持]';
      break;
    default:
      stat = false;
      break;
  }

  return {
    stat: stat,
    str: str,
    raw: raw
  }
}

function fmt_e(e: mc.Entity, name: string, args: string[]): fmt_type {
  let str = '';
  let stat = true;
  const raw: mc.RawMessage[] = [];
  let data_entity = {
    // 名称
    name: e.nameTag,

    // 生命值
    health: e.getComponent("health").currentValue,
    healthDefault: e.getComponent("health").defaultValue,
    healthMax: e.getComponent("health").effectiveMax,
    healthMin: e.getComponent("health").effectiveMin,

    // 位置
    x: e.location.x,
    y: e.location.y,
    z: e.location.z,

    // 维度
    dimension: e.dimension.localizationKey,
    dimensionWithoutLoc: function (
      overworld: string,
      nether: string,
      end: string,
    ) {
      switch (e.dimension.id) {
        case "minecraft:overworld":
          return overworld;
        case "minecraft:the_nether":
          return nether;
        case "minecraft:the_end":
          return end;
        default:
          return "未知";
      }
    },
    dimensionId: e.dimension.id,
    dimensionHeightRange: e.dimension.heightRange,

    // id
    id: e.id,

    // 行为
    behavior: function (
      climb: string,                          // 攀爬
      fall: string,                           // 跌倒
      inWater: string,                        // 水中
      onGround: string,                       // 在地上
      sleep: string,                          // 睡眠
      sneak: string,                          // 潜行
      srpint: string,                         // 冲刺
      swim: string                            // 游泳
    ) {
      let result = "";
      if (e.isClimbing) result += climb + ' ';
      if (e.isFalling) result += fall + ' ';
      if (e.isInWater) result += inWater + ' ';
      if (e.isOnGround) result += onGround + ' ';
      if (e.isSleeping) result += sleep + ' ';
      if (e.isSneaking) result += sneak + ' ';
      if (e.isSprinting) result += srpint + ' ';
      if (e.isSwimming) result += swim + ' ';
      return result;
    },

    // 类型标识符
    typeId: e.typeId,
  }

  switch (name) {
    case 'name':
      raw.push({ text: data_entity.name });
      str += data_entity.name;
      break;
    case 'health':
      raw.push({ text: data_entity.health.toString() });
      str += data_entity.health.toString();
      break;
    case 'healthDefault':
      raw.push({ text: data_entity.healthDefault.toString() });
      str += data_entity.healthDefault.toString();
      break;
    case 'healthMax':
      raw.push({ text: data_entity.healthMax.toString() });
      str += data_entity.healthMax.toString();
      break;
    case 'healthMin':
      raw.push({ text: data_entity.healthMin.toString() });
      str += data_entity.healthMin.toString();
      break;
    case 'x':
      raw.push({ text: data_entity.x.toString() });
      str += data_entity.x.toString();
      break;
    case 'y':
      raw.push({ text: data_entity.y.toString() });
      str += data_entity.y.toString();
      break;
    case 'z':
      raw.push({ text: data_entity.z.toString() });
      str += data_entity.z.toString();
      break;
    case 'dimension':
      raw.push({ translate: data_entity.dimension });
      str += '[不支持]';
      break;
    case 'dimensionWithoutLoc':
      if (args.length < 3) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_entity.dimensionWithoutLoc(args[0], args[1], args[2]) });
      str += data_entity.dimensionWithoutLoc(args[0], args[1], args[2]);
      break;
    case 'dimensionId':
      raw.push({ text: data_entity.dimensionId });
      str += data_entity.dimensionId;
      break;
    case 'dimensionHeightRange':
      raw.push({ text: data_entity.dimensionHeightRange.toString() });
      str += data_entity.dimensionHeightRange.toString();
      break;
    case 'id':
      raw.push({ text: data_entity.id });
      str += data_entity.id;
      break;
    case 'behavior':
      if (args.length < 8) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_entity.behavior(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]) });
      str += data_entity.behavior(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
      break;
    case 'typeId':
      raw.push({ text: data_entity.typeId });
      str += data_entity.typeId;
      break;
    default:
      stat = false;
  }
  return {
    stat: stat,
    str: str,
    raw: raw
  }
}

function fmt_b(b: mc.Block, name: string, args: string[]): fmt_type {
  let str = '';
  let stat = true;
  const raw: mc.RawMessage[] = [];
  let data_block = {
    // 名称
    name: b.localizationKey,
    typeID: b.typeId,

    // 位置
    x: b.location.x,
    y: b.location.y,
    z: b.location.z,

    // 维度
    dimension: b.dimension.localizationKey,
    dimensionWithoutLoc: function (
      overworld: string,
      nether: string,
      end: string,
    ) {
      switch (b.dimension.id) {
        case "minecraft:overworld":
          return overworld;
        case "minecraft:the_nether":
          return nether;
        case "minecraft:the_end":
          return end;
        default:
          return "未知";
      }
    },
    dimensionId: b.dimension.id,
    dimensionHeightRange: b.dimension.heightRange,

    // 状态
    isAir: (y: string, n: string) => b.isAir ? y : n,
    isLiquid: (y: string, n: string) => b.isLiquid ? y : n,
    isSolid: (y: string, n: string) => b.isSolid ? y : n,
    isWaterlogged: (y: string, n: string) => b.isWaterlogged ? y : n,
  }

  switch (name) {
    case 'name':
      raw.push({ translate: data_block.name });
      str += '[不支持]';
      break;
    case 'typeID':
      raw.push({ text: data_block.typeID.toString() });
      str += data_block.typeID.toString();
      break;
    case 'dimension':
      raw.push({ translate: data_block.dimension });
      str += '[不支持]';
      break;
    case 'dimensionWithoutLoc':
      if (args.length < 3) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_block.dimensionWithoutLoc(args[0], args[1], args[2]) });
      str += data_block.dimensionWithoutLoc(args[0], args[1], args[2]);
      break;
    case 'dimensionId':
      raw.push({ text: data_block.dimensionId });
      str += data_block.dimensionId;
      break;
    case 'dimensionHeightRange':
      raw.push({ text: data_block.dimensionHeightRange.toString() });
      str += data_block.dimensionHeightRange.toString();
      break;
    case 'isAir':
      if (args.length < 2) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_block.isAir(args[0], args[1]) });
      str += data_block.isAir(args[0], args[1]);
      break;
    case 'isSolid':
      if (args.length < 2) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_block.isSolid(args[0], args[1]) });
      str += data_block.isSolid(args[0], args[1]);
      break;
    case 'isWaterlogged':
      if (args.length < 2) {
        raw.push({ text: '[参数不足]' });
        str += '[参数不足]';
      }
      raw.push({ text: data_block.isWaterlogged(args[0], args[1]) });
      str += data_block.isWaterlogged(args[0], args[1]);
      break;
    default:
      stat = false;
  }
  return {
    stat: stat,
    str: str,
    raw: raw
  }
}

function fmt_dbg(name: string, args: string[]): fmt_type {
  let str = '';
  let stat = true;
  const raw: mc.RawMessage[] = [];
  let rt = mcdbg.collectRuntimeStats();
  let data_dbg = {
    // 运行时统计信息
    arrayCount: rt.arrayCount,      // 数组数量
    atomCount: rt.atomCount,        // 原子数量
    atomSize: rt.atomSize,          // 原子大小
    fastArrayCount: rt.fastArrayCount,  // 快速数组数量
    fastArrayElementCount: rt.fastArrayElementCount,  // 快速数组元素数量
    functionCodeSize: rt.functionCodeSize,  // 函数代码大小
    functionCount: rt.functionCount,  // 函数数量
    functionLineCount: rt.functionLineCount,  // 函数行数
    functionSize: rt.functionSize,  // 函数大小
    memoryAllocatedCount: rt.memoryAllocatedCount,  // 已分配内存数量
    memoryAllocatedSize: rt.memoryAllocatedSize,  // 已分配内存大小
    objectCount: rt.objectCount,  // 对象数量
    objectSize: rt.objectSize,  // 对象大小
    propertyCount: rt.propertyCount,  // 属性数量
    propertySize: rt.propertySize,  // 属性大小
    stringCount: rt.stringCount,  // 字符串数量
    stringSize: rt.stringSize,  // 字符串大小
  }

  switch (name) {
    case 'arrayCount':
      raw.push({ text: data_dbg.arrayCount.toString() });
      str += data_dbg.arrayCount.toString();
      break;
    case 'atomCount':
      raw.push({ text: data_dbg.atomCount.toString() });
      str += data_dbg.atomCount.toString();
      break;
    case 'atomSize':
      raw.push({ text: data_dbg.atomSize.toString() });
      str += data_dbg.atomSize.toString();
      break;
    case 'fastArrayCount':
      raw.push({ text: data_dbg.fastArrayCount.toString() });
      str += data_dbg.fastArrayCount.toString();
      break;
    case 'fastArrayElementCount':
      raw.push({ text: data_dbg.fastArrayElementCount.toString() });
      str += data_dbg.fastArrayElementCount.toString();
      break;
    case 'functionCodeSize':
      raw.push({ text: data_dbg.functionCodeSize.toString() });
      str += data_dbg.functionCodeSize.toString();
      break;
    case 'functionCount':
      raw.push({ text: data_dbg.functionCount.toString() });
      str += data_dbg.functionCount.toString();
      break;
    case 'functionLineCount':
      raw.push({ text: data_dbg.functionLineCount.toString() });
      str += data_dbg.functionLineCount.toString();
      break;
    case 'functionSize':
      raw.push({ text: data_dbg.functionSize.toString() });
      str += data_dbg.functionSize.toString();
      break;
    case 'memoryAllocatedCount':
      raw.push({ text: data_dbg.memoryAllocatedCount.toString() });
      str += data_dbg.memoryAllocatedCount.toString();
      break;
    case 'memoryAllocatedSize':
      raw.push({ text: data_dbg.memoryAllocatedSize.toString() });
      str += data_dbg.memoryAllocatedSize.toString();
      break;
    case 'objectCount':
      raw.push({ text: data_dbg.objectCount.toString() });
      str += data_dbg.objectCount.toString();
      break;
    case 'objectSize':
      raw.push({ text: data_dbg.objectSize.toString() });
      str += data_dbg.objectSize.toString();
      break;
    case 'propertyCount':
      raw.push({ text: data_dbg.propertyCount.toString() });
      str += data_dbg.propertyCount.toString();
      break;
    case 'propertySize':
      raw.push({ text: data_dbg.propertySize.toString() });
      str += data_dbg.propertySize.toString();
      break;
    default:
      stat = false;
  }

  return {
    stat: stat,
    str: str,
    raw: raw
  }
}


export function fmt_str(str: string, data: {
  p?: mc.Player,
  e?: mc.Entity,
  b?: mc.Block,
  dbg?: boolean,
}): { str: string, raw: mc.RawMessage } {
  const kw = match(str);
  const raw: mc.RawMessage[] = [];
  let p = data.p ?? null;
  let e = data.e ?? null;
  let b = data.b ?? null;
  let dbg = data.dbg ?? true;

  for (const it of kw) {
    if (typeof it === 'string') {
      // 处理普通文本
      raw.push({ text: it });
      str += it;
      continue;
    }
    // 处理功能标记
    let fmt_r_p: fmt_type;
    let fmt_r_e: fmt_type;
    let fmt_r_b: fmt_type;
    let fmt_r_dbg: fmt_type;

    if (p) fmt_r_p = fmt_p(p, it.name, it.args);
    if (e) fmt_r_e = fmt_e(e, it.name, it.args);
    if (b) fmt_r_b = fmt_b(b, it.name, it.args);
    if (dbg) fmt_r_dbg = fmt_dbg(it.name, it.args);

    if (fmt_r_p && fmt_r_p.stat) {
      raw.push(...fmt_r_p.raw);
      str += fmt_r_p.str;
    }
    if (fmt_r_e && fmt_r_e.stat) {
      raw.push(...fmt_r_e.raw);
      str += fmt_r_e.str;
    }
    if (fmt_r_b && fmt_r_b.stat) {
      raw.push(...fmt_r_b.raw);
      str += fmt_r_b.str;
    }
    if (fmt_r_dbg && fmt_r_dbg.stat) {
      raw.push(...fmt_r_dbg.raw);
      str += fmt_r_dbg.str;
    }

    if (!(((fmt_r_p?.stat ?? true) &&
      (fmt_r_e?.stat ?? true) &&
      (fmt_r_b?.stat ?? true)) ||
      (fmt_r_dbg?.stat ?? true))
    ) {
      raw.push({ text: '[未知标记]' });
      str += '[未知标记]';
    }
  }

  return {
    str: str,
    raw: { rawtext: raw }
  };
}