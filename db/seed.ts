import {prisma} from '@/db/prisma'
import sampleData from "./sample-data";
import { seedData } from '@/lib/utils';


async function main() {
    console.log('开始初始化数据库...');
    
    // 初始化用户数据
    await seedData('user', sampleData.users);
    
    // 初始化产品数据
    await seedData('product', sampleData.products);
    
    console.log('数据库初始化完成！');
    await prisma.$disconnect();
}

main()
    .catch((error) => {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    });