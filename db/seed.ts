import { PrismaClient } from "../app/generated/prisma";
import sampleData from "./sample-data";

async function main() {
    try {
        console.log('开始初始化数据库...');
        const prisma = new PrismaClient();
        
        console.log('清空现有产品数据...');
        await prisma.product.deleteMany();
        
        console.log('开始插入示例产品数据...');
        const result = await prisma.product.createMany({
            data: sampleData.products
        });
        
        console.log(`成功插入 ${result.count} 条产品数据`);
        console.log('数据库初始化完成！');
        
        await prisma.$disconnect();
    } catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
}

main()
    .catch((error) => {
        console.error('发生错误:', error);
        process.exit(1);
    });