import {
  cmdorigin,
  srctype,
  statutype,
  cmdtype,
  perlvl,
  argtype,
  sys
} from 'type'

import * as mcdbg from '@minecraft/debug-utilities'
import { permissions } from 'permissions';

export let rtstat: cmdtype = {
    name: "ac:rtstat",
    description: "获取游戏运行时信息",
    permissionLevel: permissions.rtstat ?? perlvl.GameDirectors,
}

export function rtstatfunc(o: cmdorigin) {
  let rt=mcdbg.collectRuntimeStats();
  let arrayCount=rt.arrayCount;
  let atomCount=rt.atomCount;
  let atomSize=rt.atomSize;
  let fastArrayCount=rt.fastArrayCount;
  let fastArrayElementCount=rt.fastArrayElementCount;
  let functionCodeSize=rt.functionCodeSize;
  let functionCount=rt.functionCount;
  let functionLineCount=rt.functionLineCount;
  let functionSize=rt.functionSize;
  let memoryAllocatedCount=rt.memoryAllocatedCount;
  let memoryAllocatedSize=rt.memoryAllocatedSize;
  let memoryUsedCount=rt.memoryUsedCount;
  let memoryUsedSize=rt.memoryUsedSize;
  let objectCount=rt.objectCount;
  let objectSize=rt.objectSize;
  let propertyCount=rt.propertyCount;
  let propertySize=rt.propertySize;
  let stringCount=rt.stringCount;
  let stringSize=rt.stringSize;

  let msg=
    '§l§v运行时信息§r\n'+
    '§r§b--------------------§r\n' +
    `§r数组数量: §a${arrayCount}§r\n`+
    `§r原子数量: §a${atomCount}§r\n`+
    `§r原子大小: §a${atomSize}§r\n`+
    `§r快速数组数量: §a${fastArrayCount}§r\n`+
    `§r快速数组元素数量: §a${fastArrayElementCount}§r\n`+
    `§r函数代码大小: §a${functionCodeSize}§r\n`+
    `§r函数数量: §a${functionCount}§r\n`+
    `§r函数行数: §a${functionLineCount}§r\n`+
    `§r函数大小: §a${functionSize}§r\n`+
    `§r分配内存数量: §a${memoryAllocatedCount}§r\n`+
    `§r分配内存大小: §a${memoryAllocatedSize}§r\n`+
    `§r已用内存数量: §a${memoryUsedCount}§r\n`+
    `§r已用内存大小: §a${memoryUsedSize}§r\n`+
    `§r对象数量: §a${objectCount}§r\n`+
    `§r对象大小: §a${objectSize}§r\n`+
    `§r属性数量: §a${propertyCount}§r\n`+
    `§r属性大小: §a${propertySize}§r\n`+
    `§r字符串数量: §a${stringCount}§r\n`+
    `§r字符串大小: §a${stringSize}§r\n`;

    return {
      status: statutype.Success,
      message: msg,
    }
}