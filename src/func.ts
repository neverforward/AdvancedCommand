import * as mc from '@minecraft/server';
import * as mcdbg from '@minecraft/debug-utilities';
import { health } from 'cmd/health';

type returnType = string | { name: string; args?: string[] };

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

function matche(str: string): returnType[] {
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

// TODO 添加block支持
export function fmt_str(str: string, type: 'p' | 'e' | 'n', p?: mc.Player, e?: mc.Entity): { str: string, raw: mc.RawMessage } {
  let rt=mcdbg.collectRuntimeStats();
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
    graphicsMode: function (
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
    inputMode: function (
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
    permissionLevel: function (
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
    gameMode: function (
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

  const kw = matche(str);
  const raw: mc.RawMessage[] = [];
  let fmt_str = '';
  let flag=false;

  for (const it of kw) {
    if (typeof it === 'string') {
      // 处理普通文本
      raw.push({ text: it });
      fmt_str += it;
      continue;
    }
    // 处理功能标记
    const name = it.name;
    const args = it.args;

    if (type == 'p') switch (name) {
      case 'name':
        raw.push({ text: data_player.name });
        fmt_str += data_player.name;
        flag=true;
        break;
      case 'nameTag':
        raw.push({ text: data_player.nameTag });
        fmt_str += data_player.nameTag;
        flag=true;
        break;
      case 'health':
        raw.push({ text: data_player.health.toString() });
        fmt_str += data_player.health.toString();
        flag=true;
        break;
      case 'healthDefault':
        raw.push({ text: data_player.healthDefault.toString() });
        fmt_str += data_player.healthDefault.toString();
        flag=true;
        break;
      case 'healthMax':
        raw.push({ text: data_player.healthMax.toString() });
        fmt_str += data_player.healthMax.toString();
        flag=true;
        break;
      case 'healthMin':
        raw.push({ text: data_player.healthMin.toString() });
        fmt_str += data_player.healthMin.toString();
        flag=true;
        break;
      case 'x':
        raw.push({ text: data_player.x.toString() });
        fmt_str += data_player.x.toString();
        flag=true;
        break;
      case 'y':
        raw.push({ text: data_player.y.toString() });
        fmt_str += data_player.y.toString();
        flag=true;
        break;
      case 'z':
        raw.push({ text: data_player.z.toString() });
        fmt_str += data_player.z.toString();
        flag=true;
        break;
      case 'dimension':
        raw.push({ translate: data_player.dimension });
        fmt_str += '[不支持]';
        flag=true;
        break;
      case 'dimensionWithoutLoc':
        if (args.length < 3) {
          raw.push({ text: '[参数不足]' });
          fmt_str += '[参数不足]';
        }
        raw.push({ text: data_player.dimensionWithoutLoc(args[0], args[1], args[2]) });
        fmt_str += data_player.dimensionWithoutLoc(args[0], args[1], args[2]);
        flag=true;
        break;
      case 'dimensionId':
        raw.push({ text: data_player.dimensionId });
        fmt_str += data_player.dimensionId;
        flag=true;
        break;
      case 'dimensionHeightRange':
        raw.push({ text: data_player.dimensionHeightRange.toString() });
        fmt_str += data_player.dimensionHeightRange.toString();
        flag=true;
        break;
      case 'graphicsMode':
        if (args.length < 4) {
          raw.push({ text: '[参数不足]' });
          fmt_str += '[参数不足]';
        }
        raw.push({ text: data_player.graphicsMode(args[0], args[1], args[2], args[3]) });
        fmt_str += data_player.graphicsMode(args[0], args[1], args[2], args[3]);
        flag=true;
        break;
      case 'inputMode':
        if (args.length < 4) {
          raw.push({ text: '[参数不足]' });
          fmt_str += '[参数不足]';
        }
        raw.push({ text: data_player.inputMode(args[0], args[1], args[2], args[3]) });
        fmt_str += data_player.inputMode(args[0], args[1], args[2], args[3]);
        flag=true;
        break;
      case 'behavior':
        if (args.length < 12) {
          raw.push({ text: '[参数不足]' });
          fmt_str += '[参数不足]';
        }
        raw.push({ text: data_player.behavior(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]) });
        fmt_str += data_player.behavior(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]);
        flag=true;
        break;
      case 'level':
        raw.push({ text: data_player.level.toString() });
        fmt_str += data_player.level.toString();
        flag=true;
        break;
      case 'permissionLevel':
        if (args.length < 4) {
          raw.push({ text: '[参数不足]' });
          fmt_str += '[参数不足]';
        }
        raw.push({ text: data_player.permissionLevel(args[0], args[1], args[2], args[3]) });
        fmt_str += data_player.permissionLevel(args[0], args[1], args[2], args[3]);
        flag=true;
        break;
      case 'selectedSlotIndex':
        raw.push({ text: data_player.selectedSlotIndex.toString() });
        fmt_str += data_player.selectedSlotIndex.toString();
        flag=true;
        break;
      case 'gameMode':
        if (args.length < 4) {
          raw.push({ text: '[参数不足]' });
          fmt_str += '[参数不足]';
        }
        raw.push({ text: data_player.gameMode(args[0], args[1], args[2], args[3]) });
        fmt_str += data_player.gameMode(args[0], args[1], args[2], args[3]);
        flag=true;
        break;
    }
    else if (type == 'e') switch (name) {
      case 'name':
        raw.push({ text: data_entity.name });
        fmt_str += data_entity.name;
        flag=true;
        break;
      case 'health':
        raw.push({ text: data_entity.health.toString() });
        fmt_str += data_entity.health.toString();
        flag=true;
        break;
      case 'healthDefault':
        raw.push({ text: data_entity.healthDefault.toString() });
        fmt_str += data_entity.healthDefault.toString();
        flag=true;
        break;
      case 'healthMax':
        raw.push({ text: data_entity.healthMax.toString() });
        fmt_str += data_entity.healthMax.toString();
        flag=true;
        break;
      case 'healthMin':
        raw.push({ text: data_entity.healthMin.toString() });
        fmt_str += data_entity.healthMin.toString();
        flag=true;
        break;
      case 'x':
        raw.push({ text: data_entity.x.toString() });
        fmt_str += data_entity.x.toString();
        flag=true;
        break;
      case 'y':
        raw.push({ text: data_entity.y.toString() });
        fmt_str += data_entity.y.toString();
        flag=true;
        break;
      case 'z':
        raw.push({ text: data_entity.z.toString() });
        fmt_str += data_entity.z.toString();
        flag=true;
        break;
      case 'dimension':
        raw.push({ translate: data_entity.dimension });
        fmt_str += '[不支持]';
        flag=true;
        break;
      case 'dimensionWithoutLoc':
        if (args.length < 3) {
          raw.push({ text: '[参数不足]' });
          fmt_str += '[参数不足]';
        }
        raw.push({ text: data_entity.dimensionWithoutLoc(args[0], args[1], args[2]) });
        fmt_str += data_entity.dimensionWithoutLoc(args[0], args[1], args[2]);
        flag=true;
        break;
      case 'dimensionId':
        raw.push({ text: data_entity.dimensionId });
        fmt_str += data_entity.dimensionId;
        flag=true;
        break;
      case 'dimensionHeightRange':
        raw.push({ text: data_entity.dimensionHeightRange.toString() });
        fmt_str += data_entity.dimensionHeightRange.toString();
        flag=true;
        break;
      case 'id':
        raw.push({ text: data_entity.id });
        fmt_str += data_entity.id;
        flag=true;
        break;
      case 'behavior':
        if (args.length < 8) {
          raw.push({ text: '[参数不足]' });
          fmt_str += '[参数不足]';
        }
        raw.push({ text: data_entity.behavior(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]) });
        fmt_str += data_entity.behavior(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        flag=true;
        break;
      case 'typeId':
        raw.push({ text: data_entity.typeId });
        fmt_str += data_entity.typeId;
        flag=true;
        break;
    }

    // 调试信息
    switch (name) {
      case 'arrayCount':
        raw.push({ text: data_dbg.arrayCount.toString() });
        fmt_str += data_dbg.arrayCount.toString();
        flag=true;
        break;
      case 'atomCount':
        raw.push({ text: data_dbg.atomCount.toString() });
        fmt_str += data_dbg.atomCount.toString();
        flag=true;
        break;
      case 'atomSize':
        raw.push({ text: data_dbg.atomSize.toString() });
        fmt_str += data_dbg.atomSize.toString();
        flag=true;
        break;
      case 'fastArrayCount':
        raw.push({ text: data_dbg.fastArrayCount.toString() });
        fmt_str += data_dbg.fastArrayCount.toString();
        flag=true;
        break;
      case 'fastArrayElementCount':
        raw.push({ text: data_dbg.fastArrayElementCount.toString() });
        fmt_str += data_dbg.fastArrayElementCount.toString();
        flag=true;
        break;
      case 'functionCodeSize':
        raw.push({ text: data_dbg.functionCodeSize.toString() });
        fmt_str += data_dbg.functionCodeSize.toString();
        flag=true;
        break;
      case 'functionCount':
        raw.push({ text: data_dbg.functionCount.toString() });
        fmt_str += data_dbg.functionCount.toString();
        flag=true;
        break;
      case 'functionLineCount':
        raw.push({ text: data_dbg.functionLineCount.toString() });
        fmt_str += data_dbg.functionLineCount.toString();
        flag=true;
        break;
      case 'functionSize':
        raw.push({ text: data_dbg.functionSize.toString() });
        fmt_str += data_dbg.functionSize.toString();
        flag=true;
        break;
      case 'memoryAllocatedCount':
        raw.push({ text: data_dbg.memoryAllocatedCount.toString() });
        fmt_str += data_dbg.memoryAllocatedCount.toString();
        flag=true;
        break;
      case 'memoryAllocatedSize':
        raw.push({ text: data_dbg.memoryAllocatedSize.toString() });
        fmt_str += data_dbg.memoryAllocatedSize.toString();
        break;
      case 'objectCount':
        raw.push({ text: data_dbg.objectCount.toString() });
        fmt_str += data_dbg.objectCount.toString();
        break;
      case 'objectSize':
        raw.push({ text: data_dbg.objectSize.toString() });
        fmt_str += data_dbg.objectSize.toString();
        break;
      case 'propertyCount':
        raw.push({ text: data_dbg.propertyCount.toString() });
        fmt_str += data_dbg.propertyCount.toString();
        break;
      case 'propertySize':
        raw.push({ text: data_dbg.propertySize.toString() });
        fmt_str += data_dbg.propertySize.toString();
        break;
    }
  }

  return {
    str: fmt_str,
    raw: { rawtext: raw }
  };
}