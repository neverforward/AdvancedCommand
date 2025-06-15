import { statutype, perlvl, argtype } from 'type';
export let err = {
    name: "ac:err",
    description: "在控制台中打印错误",
    permissionLevel: perlvl.GameDirectors,
    mandatoryParameters: [
        {
            name: "message",
            type: argtype.String
        }
    ]
};
export function errfunc(o, msg) {
    console.error(msg);
    return {
        status: statutype.Success,
        message: "错误打印成功"
    };
}
