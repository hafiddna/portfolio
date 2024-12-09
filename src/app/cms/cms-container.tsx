"use client";
import React from "react";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';

export default function CMSContainer({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <AntdRegistry>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    components: {
                        Tabs: {
                            inkBarColor: "#EDEDED",
                        }
                    }
                }}
            >
                {children}
            </ConfigProvider>
        </AntdRegistry>
    )
}
