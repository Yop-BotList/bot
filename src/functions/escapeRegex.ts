export default function escapeRegex(str: string) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (error: any) {
        console.log(String(error.stack).bgRed);
    }
}