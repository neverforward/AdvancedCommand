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

export let pi: cmdtype = {
  name: "ac:pi",
  description: "获取玩家信息",
  permissionLevel: perlvl.GameDirectors,
  mandatoryParameters: [
    {
      name: 'player',
      type: argtype.PlayerSelector
    }
  ]
}

export function pifunc(o: cmdorigin, ps: mc.Player[]) {
  let msg = `§l§6[玩家信息]§r\n`;
  for (const p of ps) {
    let RD = p.clientSystemInfo.maxRenderDistance;
    let maxMemory: string;
    let pftype: string;
    let inputMode: string;
    let gm: string;
    let pos = p.location
    let graphicsMode: string;

    switch (p.clientSystemInfo.memoryTier) {
      case mc.MemoryTier.SuperLow:
        maxMemory = '超低';
        break;
      case mc.MemoryTier.Low:
        maxMemory = '低';
        break;
      case mc.MemoryTier.Mid:
        maxMemory = '中';
        break;
      case mc.MemoryTier.High:
        maxMemory = '高';
        break;
      case mc.MemoryTier.SuperHigh:
        maxMemory = '超高';
        break
    }
    switch (p.clientSystemInfo.platformType) {
      case mc.PlatformType.Desktop:
        pftype = 'PC';
        break;
      case mc.PlatformType.Mobile:
        pftype = '手机';
        break;
      case mc.PlatformType.Console:
        pftype = '主机';
        break;
    }
    switch (p.inputInfo.lastInputModeUsed) {
      case mc.InputMode.Gamepad:
        inputMode = '游戏手柄';
        break;
      case mc.InputMode.KeyboardAndMouse:
        inputMode = '键盘鼠标';
        break;
      case mc.InputMode.MotionController:
        inputMode = '运动控制器 (VR)';
        break;
      case mc.InputMode.Touch:
        inputMode = '触屏';
        break
    }
    switch (p.getGameMode()) {
      case mc.GameMode.Adventure:
        gm = '冒险';
        break;
      case mc.GameMode.Creative:
        gm = '创造';
        break;
      case mc.GameMode.Spectator:
        gm = '旁观者';
        break;
      case mc.GameMode.Survival:
        gm = '生存';
        break;
    }
    switch (p.graphicsMode) {
      case mc.GraphicsMode.Deferred:
        graphicsMode = '延迟渲染';
        break;
      case mc.GraphicsMode.Fancy:
        graphicsMode = '华丽'
        break;
      case mc.GraphicsMode.RayTraced:
        graphicsMode = '光线追踪'
        break;
      case mc.GraphicsMode.Simple:
        graphicsMode = '简易'
        break;
    }

    msg +=
      `§l§v${p.name}\n` +
      `§r§b--------------------§r\n` +
      `唯一标识符: §s${p.id}§r\n` +
      `游戏模式: §e${gm}§r\n` +
      `位置: §c${pos.x.toFixed(2)} §a${pos.y.toFixed(2)} §9${pos.z.toFixed(2)}§r\n` +
      `图形模式: §q${graphicsMode}§r\n` +
      `最大渲染距离: §b${RD}§r\n` +
      `最大内存: §a${maxMemory}§r\n` +
      `平台类型: §d${pftype}§r\n` +
      `输入模式: §6${inputMode}§r\n` +
      `触控板控制热键: ${p.inputInfo.touchOnlyAffectsHotbar ? '§a是' : '§c否'}§r\n` +
      `移动向量: §c${p.inputInfo.getMovementVector().x} §9${p.inputInfo.getMovementVector().y}\n§r\n`;
  }
  return {
    status: statutype.Success,
    message: msg
  }
}