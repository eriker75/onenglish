"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Users, School, BookOpen, TrendingUp, Award } from 'lucide-react';
import { getDemoStatistics } from "@/src/data/demo-data";

const StatisticsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await getDemoStatistics();
        setStats(data);
      } catch (error) {
        console.error("Error loading statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <DashboardContent>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Estadísticas Olímpicas
            </h1>
            <p className="text-muted-foreground">
              Análisis de desempeño de las Olimpiadas Bilingües {selectedYear}
            </p>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <StatCard
                title="Escuelas Registradas"
                value={stats?.registeredSchools}
                icon={School}
                color="pink"
              />
              <StatCard
                title="Total Estudiantes"
                value={stats?.totalStudents}
                icon={Users}
                color="green"
              />
              <StatCard
                title="Estudiantes Participando"
                value={stats?.participatingStudents}
                icon={Award}
                color="yellow"
              />
              <StatCard
                title="Total Preguntas"
                value={stats?.totalQuestions}
                icon={BookOpen}
                color="purple"
              />
            </>
          )}
        </div>

        {/* Performance by Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Desempeño por Área Olímpica
            </CardTitle>
            <CardDescription>
              Rendimiento promedio de estudiantes en cada área
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando datos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {stats?.performanceByArea.map((area: any) => (
                  <PerformanceCard key={area.area} area={area} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance by Grade */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Desempeño por Grado</CardTitle>
            <CardDescription>
              Distribución de rendimiento académico por grado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando datos...</p>
            ) : (
              <div className="space-y-4">
                {stats?.performanceByGrade.map((grade: any) => (
                  <div key={grade.grade}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{grade.grade}</span>
                      <span className="text-sm font-semibold">{grade.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
                        style={{ width: `${grade.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Schools Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Escuelas por Participación</CardTitle>
            <CardDescription>
              Escuelas con mayor tasa de participación estudiantil
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando datos...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-semibold">Escuela</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Estudiantes</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Participación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.topSchools.map((school: any, index: number) => (
                      <tr key={index} className="border-b border-border hover:bg-accent/50">
                        <td className="px-4 py-3 font-medium">{school.name}</td>
                        <td className="px-4 py-3">{school.students}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{school.participation}%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardContent>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'pink' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    pink: 'from-pink-500 to-pink-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold">{value?.toLocaleString?.() || value}</p>
      </CardContent>
    </Card>
  );
}

function PerformanceCard({ area }: { area: any }) {
  const areaColors: Record<string, string> = {
    Vocabulary: '#FF0098',
    Grammar: '#33CC00',
    Listening: '#f2bf3c',
    Writing: '#9000d9',
    Speaking: '#E63946'
  };

  return (
    <div className="text-center">
      <div
        className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
        style={{ backgroundColor: area.color }}
      >
        {area.percentage}%
      </div>
      <h3 className="font-semibold text-sm mb-2">{area.area}</h3>
      <p className="text-xs text-muted-foreground">{area.students} estudiantes</p>
    </div>
  );
}

export default StatisticsPage;
