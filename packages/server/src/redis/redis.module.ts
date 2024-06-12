import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from "redis";
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    providers: [
        RedisService,
        {
            provide: 'REDIS_CLIENT',
            async useFactory(configService: ConfigService) {
                console.log(configService,'configService');
                
                const client = createClient({
                    socket: {
                        host: configService.get('redis_server_host'),
                        port: 6379
                    },
                    database: 0
                })
                await client.connect()
                return client
            }
        }
    ],
    exports: [RedisService]
})
export class RedisModule { }
