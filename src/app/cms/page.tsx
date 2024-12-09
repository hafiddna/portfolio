"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/card";
import { db } from "@/lib/firebase";
import { PageStatistic, Visitor } from "@/models/page-statistic";
import { Select, DatePicker, Tabs, Tooltip as AntdTooltip } from 'antd';
import type { SelectProps } from 'antd';
import dayjs from "dayjs";
import { collection, getDocs, query } from "firebase/firestore";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// TODO: Fix custom class attributes

const { RangePicker } = DatePicker;

const data = [
    {
        date: 'Nov 27',
        value: 6,
        dashed_value: null,
    },
    {
        date: 'Nov 28',
        value: 1,
        dashed_value: null,
    },
    {
        date: 'Nov 29',
        value: 6,
        dashed_value: null,
    },
    {
        date: 'Nov 30',
        value: 2,
        dashed_value: null,
    },
    {
        date: 'Dec 1',
        value: 6,
        dashed_value: null,
    },
    {
        date: 'Dec 2',
        value: 2,
        dashed_value: null,
    },
    {
        date: 'Dec 3',
        value: 3,
        dashed_value: 3,
    },
    {
        date: 'Dec 4',
        value: null,
        dashed_value: 3,
    },
];

const periodOptions: SelectProps['options'] = [
    { label: 'Last 24 Hours', value: 'Last 24 Hours' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'Last 30 Days', value: 'Last 30 Days' },
    { label: 'Last 3 Months', value: 'Last 3 Months' },
    { label: 'Last 12 Months', value: 'Last 12 Months' },
    { label: 'Last 24 Months', value: 'Last 24 Months' },
];

export default function Dashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [pageStatistics, setPageStatistics] = useState<PageStatistic[]>([]);
    const [firstLoading, setFirstLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [typeFilter, setTypeFilter] = useState<"visitors" | "page_views">("visitors");
    const [periodTypeFilter, setPeriodTypeFilter] = useState<"period" | "from-to">("period")
    const [periodFilter, setPeriodFilter] = useState<"Last 24 Hours" | "Last 7 Days" | "Last 30 Days" | "Last 3 Months" | "Last 12 Months" | "Last 24 Months">("Last 7 Days");
    const [fromFilter, setFromFilter] = useState(dayjs().subtract(7, 'day').unix());
    const [toFilter, setToFilter] = useState(dayjs().unix());
    const [pageFilter, setPageFilter] = useState<null | string>(null);
    const [countryFilter, setCountryFilter] = useState<null | string>(null);
    const [deviceFilter, setDeviceFilter] = useState<null | string>(null);
    const [browserFilter, setBrowserFilter] = useState<null | string>(null);
    const [osFilter, setOsFilter] = useState<null | string>(null);

    const [visitor, setVisitor] = useState({count: 0, percentage: 0});
    const [visitorChart, setVisitorChart] = useState<any[]>([]);
    const [pageView, setPageView] = useState({count: 0, percentage: 0});
    const [pageViewChart, setPageViewChart] = useState<any[]>([]);

    const [pagesView, setPagesView] = useState({visitors: [{name: "", count: 0}], page_views: [{name: "", count: 0}]});
    const [countriesView, setCountriesView] = useState({visitors: [{emoji: "", country: "", percentage: 0}], page_views: [{emoji: "", country: "", percentage: 0}]});
    const [devicesView, setDevicesView] = useState({visitors: [{name: "", percentage: 0}], page_views: [{name: "", percentage: 0}]});
    const [browserView, setBrowserView] = useState({visitors: [{name: "", percentage: 0}], page_views: [{name: "", percentage: 0}]});
    const [osView, setOsView] = useState({visitors: [{name: "", percentage: 0}], page_views: [{name: "", percentage: 0}]});

    useEffect(() => {
        const currentSearchParams = new URLSearchParams(searchParams.toString());
        const periodParam = currentSearchParams.get('period');
        const fromParam = currentSearchParams.get('from');
        const toParam = currentSearchParams.get('to');

        if (periodParam) {
            const periodsOption = ["24h", "30d", "3m", "12m", "24m"];

            if (!periodsOption.includes(periodParam)) {
                currentSearchParams.delete('period');
                router.push(`?${currentSearchParams.toString()}`);
                return;
            }

            setPeriodTypeFilter("period");
            if (periodParam == "24h") {
                setPeriodFilter("Last 24 Hours");
            } else if (periodParam == "30d") {
                setPeriodFilter("Last 30 Days");
            } else if (periodParam == "3m") {
                setPeriodFilter("Last 3 Months");
            } else if (periodParam == "12m") {
                setPeriodFilter("Last 12 Months");
            } else if (periodParam == "24m") {
                setPeriodFilter("Last 24 Months");
            }
        } else if (fromParam && toParam) {
            if (Number(fromParam) > Number(toParam) || isNaN(Number(fromParam)) || isNaN(Number(toParam))) {
                currentSearchParams.delete('from');
                currentSearchParams.delete('to');
                router.push(`?${currentSearchParams.toString()}`);
                return;
            }

            setPeriodTypeFilter("from-to");
            const latestFrom = dayjs().subtract(24, 'month').unix();
            const latestTo = dayjs().unix();
            setFromFilter(Number(fromParam) < latestFrom ? latestFrom : Number(fromParam));
            setToFilter(Number(toParam) > latestTo ? latestTo : Number(toParam));
        }

        // TODO: Should also set another filters from URLSearchParams
    }, [router, searchParams]);

    const fetchData = async () => {
        try {
            const pageStatisticsRef = collection(db, "page_statistics");
            const pageStatisticsQuery = query(pageStatisticsRef);
            const pageStatisticsSnapshot = await getDocs(pageStatisticsQuery);
            return pageStatisticsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            setError(true);
            throw error;
        }
    };

    useEffect(() => {
        fetchData().then((data) => {
            setPageStatistics(data);
            setFirstLoading(false);
        }).catch(() => {
            setError(true);
            setFirstLoading(false);
        });
    }, []);

    useEffect(() => {
        // TODO: Audit filter logics
        if (!firstLoading && !error && pageStatistics.length > 0) {
            let datesBeetween = {
                last_quartal: {
                    start: 0,
                    end: 0
                },
                now: {
                    start: 0,
                    end: 0
                }
            };

            const dates: any[] = [];
            const nowIps: any[] = [];
            const lastQuartalIps: any[] = [];
            let nowPageViewCount = 0;
            let lastQuartalPageViewCount = 0;

            const newVisitorChart: any[] = data;
            const newPageViewChart: any[] = data;

            if (periodTypeFilter == "period") {
                if (periodFilter == "Last 24 Hours") {
                    datesBeetween = {
                        now: {
                            start: dayjs().subtract(24, 'hour').unix(),
                            end: dayjs().unix()
                        },
                        last_quartal: {
                            start: dayjs().subtract(48, 'hour').unix(),
                            end: dayjs().subtract(24, 'hour').unix()
                        }
                    }
                    for (let i = 0; i < 24; i++) {
                        dates.push({start: dayjs().subtract(24, 'hour').add(i, 'hour').unix(), end: dayjs().subtract(24, 'hour').add(i + 1, 'hour').unix()});
                        // newVisitorChart.push({date: dayjs().subtract(24, 'hour').add(i, 'hour').format('hA'), value: null, dashed_value: null});
                        // newPageViewChart.push({date: dayjs().subtract(24, 'hour').add(i, 'hour').format('hA'), value: null, dashed_value: null});
                    }
                } else if (periodFilter == "Last 7 Days") {
                    datesBeetween = {
                        now: {
                            start: dayjs().subtract(7, 'day').unix(),
                            end: dayjs().unix()
                        },
                        last_quartal: {
                            start: dayjs().subtract(14, 'day').unix(),
                            end: dayjs().subtract(7, 'day').unix()
                        }
                    }
                    for (let i = 0; i < 7; i++) {
                        dates.push({start: dayjs().subtract(7, 'day').add(i, 'day').unix(), end: dayjs().subtract(7, 'day').add(i + 1, 'day').unix()});
                    }
                } else if (periodFilter == "Last 30 Days") {
                    datesBeetween = {
                        now: {
                            start: dayjs().subtract(30, 'day').unix(),
                            end: dayjs().unix()
                        },
                        last_quartal: {
                            start: dayjs().subtract(60, 'day').unix(),
                            end: dayjs().subtract(30, 'day').unix()
                        }
                    }
                    for (let i = 0; i < 30; i++) {
                        dates.push({start: dayjs().subtract(30, 'day').add(i, 'day').unix(), end: dayjs().subtract(30, 'day').add(i + 1, 'day').unix()});
                    }
                } else if (periodFilter == "Last 3 Months") {
                    datesBeetween = {
                        now: {
                            start: dayjs().subtract(3, 'month').unix(),
                            end: dayjs().unix()
                        },
                        last_quartal: {
                            start: dayjs().subtract(6, 'month').unix(),
                            end: dayjs().subtract(3, 'month').unix()
                        }
                    }
                    for (let i = 0; i < 3; i++) {
                        dates.push({start: dayjs().subtract(3, 'month').add(i, 'month').unix(), end: dayjs().subtract(3, 'month').add(i + 1, 'month').unix()});
                    }
                } else if (periodFilter == "Last 12 Months") {
                    datesBeetween = {
                        now: {
                            start: dayjs().subtract(12, 'month').unix(),
                            end: dayjs().unix()
                        },
                        last_quartal: {
                            start: dayjs().subtract(24, 'month').unix(),
                            end: dayjs().subtract(12, 'month').unix()
                        }
                    }
                    for (let i = 0; i < 12; i++) {
                        dates.push({start: dayjs().subtract(12, 'month').add(i, 'month').unix(), end: dayjs().subtract(12, 'month').add(i + 1, 'month').unix()});
                    }
                } else if (periodFilter == "Last 24 Months") {
                    datesBeetween = {
                        now: {
                            start: dayjs().subtract(24, 'month').unix(),
                            end: dayjs().unix()
                        },
                        last_quartal: {
                            start: dayjs().subtract(48, 'month').unix(),
                            end: dayjs().subtract(24, 'month').unix()
                        }
                    }
                    for (let i = 0; i < 24; i++) {
                        dates.push({start: dayjs().subtract(24, 'month').add(i, 'month').unix(), end: dayjs().subtract(24, 'month').add(i + 1, 'month').unix()});
                    }
                }
            } else if (periodTypeFilter == "from-to") {
                const from = dayjs.unix(fromFilter).add(1, 'day');
                const to = dayjs.unix(toFilter).add(1, 'day');

                datesBeetween = {
                    now: {
                        start: from.unix(),
                        end: to.unix()
                    },
                    last_quartal: {
                        start: from.subtract(to.diff(from, 'day') * 2, 'day').unix(),
                        end: from.subtract(to.diff(from, 'day'), 'day').unix()
                    }
                }
            }

            pageStatistics.map((page: PageStatistic) => {
                if (page.visitor) {
                    page.visitor.map((visitor: Visitor) => {
                        if (visitor.date.seconds >= datesBeetween.now.start && visitor.date.seconds <= datesBeetween.now.end) {
                            if (!nowIps.includes(visitor.ip)) {
                                nowIps.push(visitor.ip);
                            }

                            nowPageViewCount++;
                        } else if (visitor.date.seconds >= datesBeetween.last_quartal.start && visitor.date.seconds <= datesBeetween.last_quartal.end) {
                            if (!lastQuartalIps.includes(visitor.ip)) {
                                lastQuartalIps.push(visitor.ip);
                            }

                            lastQuartalPageViewCount++;
                        }
                    });
                }
            });

            setVisitor({count: nowIps.length, percentage: Math.round(((nowIps.length - (lastQuartalIps.length == 0 ? 1 : lastQuartalIps.length)) / (lastQuartalIps.length == 0 ? 1 : lastQuartalIps.length)) * 100)});
            setVisitorChart(newVisitorChart);
            setPageView({count: nowPageViewCount, percentage: Math.round(((nowPageViewCount - (lastQuartalPageViewCount == 0 ? 1 : lastQuartalPageViewCount)) / (lastQuartalPageViewCount == 0 ? 1 : lastQuartalPageViewCount)) * 100)});
            setPageViewChart(newPageViewChart);
        }
    }, [pageStatistics, firstLoading, error, periodTypeFilter, periodFilter, fromFilter, toFilter, pageFilter, countryFilter, deviceFilter, browserFilter, osFilter]);

    const tabs = (
        <Tabs
            tabBarStyle={{ backgroundColor: "#111111" }}
            activeKey={typeFilter}
            onTabClick={(key: any) => {
                setTypeFilter(key);
            }}
            defaultActiveKey="visitors"
            size="large"
            items={["Visitors", "Page Views"].map((name, _) => {
                const key = name.toLowerCase().replace(/\s/g, "_");
                const count = key == "visitors" ? visitor.count : pageView.count;
                const percentage = key == "visitors" ? visitor.percentage : pageView.percentage;
                const chartData = key == "visitors" ? visitorChart : pageViewChart;
                return {
                    label: (
                        <div className="min-w-[220px] min-h-[70px] flex flex-col justify-center gap-2 px-4">
                            <p className="text-sm text-[#A1A1A1] font-semibold">{name}</p>
                            {!firstLoading ? (
                                <div className="flex items-center gap-4">
                                    <p className="text-[32px] text-[#EDEDED] font-semibold">
                                        {/*TODO: Add counting animation*/}
                                        {count}
                                    </p>
                                    <AntdTooltip title={`100% more visitors than the previous 7 days`}>
                                        <div className={`min-w-[46px] p-1.5 rounded-[5px] flex justify-center items-center text-xs font-medium ${percentage > 0 ? "text-[#0CCE6B] bg-[#5ECB7533]" : percentage == 0 ? "text-[#666666] bg-[#333333]" : "text-[#FF0000] bg-[#FF595933]"}`}>
                                            <p>{percentage > 0 ? "+" : ""}{percentage}%</p>
                                        </div>
                                    </AntdTooltip>
                                </div>
                            ) : (
                                <div className="h-8 w-[105px] bg-zinc-700 rounded-md animate-pulse" />
                            )}
                        </div>
                    ),
                    key: key,
                    children: (
                        !firstLoading ? (
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        width={500}
                                        height={400}
                                        data={chartData}
                                        margin={{
                                            top: 50,
                                            right: 30,
                                            left: -10,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid
                                            vertical={false}
                                            stroke={"#3F3F45"}
                                        />
                                        <XAxis
                                            tickLine={false}
                                            dataKey="date"
                                            color={"#EDEDED"}
                                            fontSize={12}
                                            // stroke={"#191919"}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tickCount={4}
                                            color={"#EDEDED"}
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            content={({active, payload, label}) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div
                                                            className="flex flex-col items-center gap-1 text-sm rounded-lg bg-black px-3 py-2"
                                                        >
                                                            <div className="flex items-center gap-2 text-zinc-100 font-bold">
                                                                <div className="w-2 h-2 rounded-full bg-[#0072F5]" />
                                                                <p>{name}</p>
                                                                <div
                                                                    className="px-1.5 py-0.5 rounded-md flex justify-center items-center bg-zinc-800/50"
                                                                >{payload[0].value}</div>
                                                            </div>
                                                            <p className="text-zinc-400">{label}</p>
                                                        </div>
                                                    );
                                                }

                                                return null;
                                            }}
                                        />
                                        <Area
                                            type="linear"
                                            dataKey="value"
                                            stroke="#0072F5"
                                            fill="#051125"
                                            activeDot={({ cx, cy, payload, value }) => {
                                                if (payload.value) {
                                                    return (
                                                        <circle cx={cx} cy={cy} r={4} fill="#0072F5"/>
                                                    )
                                                }

                                                return <></>;
                                            }}
                                        />
                                        <Area
                                            type="linear"
                                            dataKey="dashed_value"
                                            stroke="#0072F5"
                                            strokeDasharray={"5 5"}
                                            fill="#051125"
                                            activeDot={({ cx, cy, payload, value }) => {
                                                if (payload.dashed_value) {
                                                    return (
                                                        <circle cx={cx} cy={cy} r={4} fill="#0072F5"/>
                                                    )
                                                }

                                                return <></>;
                                            }}
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="min-h-[400px] min-w-full" />
                        )
                    ),
                };
            })}
        />
    );

    return !error ? (
        <>
            <div className="sm:border-b sm:border-zinc-800 sm:h-[220px] lg:h-[156px]">
                <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:gap-10 px-6 lg:px-8 lg:flex-row lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                            Dashboard
                        </h2>
                        <p className="mt-4 text-sm text-zinc-400">
                            In this page you can see the website&#39;s analytics.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <RangePicker
                            disabledDate={(current) => {
                                return current > dayjs().endOf('day') || current < dayjs().subtract(24, 'month');
                            }}
                            size="large"
                            style={{ width: 300 }}
                            onChange={(e, d) => {
                                const currentSearchParams = new URLSearchParams(searchParams.toString());

                                setPeriodTypeFilter("from-to");
                                setFromFilter(dayjs(d[0]).unix());
                                setToFilter(dayjs(d[1]).unix());

                                currentSearchParams.set('from', String(dayjs(d[0]).unix()));
                                currentSearchParams.set('to', String(dayjs(d[1]).unix()));

                                currentSearchParams.delete('period');

                                router.push(`?${currentSearchParams.toString()}`);
                            }}
                            value={[dayjs.unix(fromFilter), dayjs.unix(toFilter)]}
                        />

                        <Select
                            size="large"
                            value={periodFilter}
                            defaultValue="Last 7 Days"
                            onChange={(e: any) => {
                                setPeriodTypeFilter("period");
                                setPeriodFilter(e)

                                const currentSearchParams = new URLSearchParams(searchParams.toString());

                                let period = "7d";

                                if (e == "Last 24 Hours") {
                                    period = "24h";
                                } else if (e == "Last 30 Days") {
                                    period = "30d";
                                } else if (e == "Last 3 Months") {
                                    period = "3m";
                                } else if (e == "Last 12 Months") {
                                    period = "12m";
                                } else if (e == "Last 24 Months") {
                                    period = "24m";
                                }

                                if (period != "7d") {
                                    currentSearchParams.set('period', period);
                                } else {
                                    currentSearchParams.delete('period');
                                }

                                currentSearchParams.delete('from');
                                currentSearchParams.delete('to');

                                router.push(`?${currentSearchParams.toString()}`);
                            }}
                            style={{ width: 200 }}
                            options={periodOptions}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 sm:-mt-16 max-w-7xl mx-auto">
                <div className="col-span-12 w-full sm:px-6 lg:px-8">
                    <div className="hidden sm:block">
                        {/*@ts-expect-error just ignoring error linter*/}
                        <Card disableAnimation>
                            {tabs}
                        </Card>
                    </div>

                    <div className="sm:hidden border-y border-zinc-600 mt-4">
                        {/*@ts-expect-error just ignoring error linter*/}
                        <Card disableAnimation borderless>
                            {tabs}
                        </Card>
                    </div>
                </div>

                <div className="col-span-12 grid grid-cols-12 px-6 lg:px-8 gap-4">
                    <div className="col-span-12 lg:col-span-6 w-full">
                        {/*@ts-expect-error just ignoring error linter*/}
                        <Card disableAnimation={true}>
                            <div className="p-5 flex justify-between items-center border-b border-zinc-800">
                                <div className="font-medium text-sm text-[#EDEDED]">Pages</div>
                                <div className="text-xs text-[#A1A1A1] uppercase">{typeFilter.replace("_", " ")}</div>
                            </div>
                            <div className="flex flex-col my-2"></div>
                        </Card>
                    </div>

                    <div className="col-span-12 lg:col-span-6 w-full">
                        {/*@ts-expect-error just ignoring error linter*/}
                        <Card disableAnimation={true}>
                            <div className="p-5 flex justify-between items-center border-b border-zinc-800">
                                <div className="font-medium text-sm text-[#EDEDED]">Countries</div>
                                <div className="text-xs text-[#A1A1A1] uppercase">{typeFilter.replace("_", " ")}</div>
                            </div>
                            <div className="flex flex-col my-2"></div>
                        </Card>
                    </div>

                    <div className="col-span-12 lg:col-span-6 w-full">
                        {/*@ts-expect-error just ignoring error linter*/}
                        <Card disableAnimation={true}>
                            <div className="p-5 flex justify-between items-center border-b border-zinc-800">
                                <div className="font-medium text-sm text-[#EDEDED]">TODO: Should be radio button between Devices and Browsers</div>
                                <div className="text-xs text-[#A1A1A1] uppercase">{typeFilter.replace("_", " ")}</div>
                            </div>
                            <div className="flex flex-col my-2"></div>
                        </Card>
                    </div>

                    <div className="col-span-12 lg:col-span-6 w-full">
                        {/*@ts-expect-error just ignoring error linter*/}
                        <Card disableAnimation={true}>
                            <div className="p-5 flex justify-between items-center border-b border-zinc-800">
                                <div className="font-medium text-sm text-[#EDEDED]">Operating Systems</div>
                                <div className="text-xs text-[#A1A1A1] uppercase">{typeFilter.replace("_", " ")}</div>
                            </div>
                            <div className="flex flex-col my-2"></div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <></>
    )
}
