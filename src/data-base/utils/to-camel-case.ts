export function listChildrenKeyToCamelCase(rows: Array<{ [key: string]: string | number }>): Array<{ [key: string]: string | number }> {
    let newRows: Array<{ [key: string]: string | number }> = [];

    rows.forEach(item => {
        let obj: any = {};
        for (let key in item) {
            if (item.hasOwnProperty(key)) {
                obj[key.replace(/[-_](\w)/g, (str: string, $1: string) => {
                    return $1.toUpperCase();
                })] = item[key];
            }
        }
        newRows.push(obj);
    });

    return newRows;
}