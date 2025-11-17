"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, TrendingUp, ChevronRight, Plus, FileText, Briefcase, BarChart3, Trophy, UserCog, Clock, DollarSign, Target } from 'lucide-react';
import { 
  getDemoDashboardStats, 
  getDemoCurrentUser,
  getDemoActivities
} from "@/src/data/demo-data";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [statsData, activitiesData, userData] = await Promise.all([
          getDemoDashboardStats(),
          getDemoActivities(),
          getDemoCurrentUser()
        ]);
        
        setStats(statsData);
        setActivities(activitiesData);
        setUser(userData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const userInitial = (user?.firstName || "A").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <DashboardContent>
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Olimpiadas Bilingües 2025
            </h1>
            <p className="text-muted-foreground">
              OnEnglish - Dashboard Administrativo
            </p>
          </div>
          <Link 
            href="/dashboard/profile"
            className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center hover:shadow-lg transition-all hover:scale-105"
            title="Profile"
          >
            <span className="text-white font-semibold text-lg">{userInitial}</span>
          </Link>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Estudiantes"
            value={isLoading ? "..." : (stats?.totalStudents || 0).toLocaleString()}
            icon={Users}
            trend="+12% este mes"
            color="pink"
            subtitle={`${stats?.paidStudents || 0} con pago completado`}
          />
          <StatCard
            title="Liceos Registrados"
            value={isLoading ? "..." : stats?.registeredSchools || 0}
            icon={School}
            trend={`+2 nuevas escuelas`}
            color="green"
            subtitle={`${stats?.participationRate?.toFixed(1) || 0}% participación`}
          />
          <StatCard
            title="Ingresos Recaudados"
            value={isLoading ? "..." : `$${(stats?.revenueCollected || 0).toLocaleString()}`}
            icon={DollarSign}
            trend="87% tasa de pago"
            color="yellow"
            subtitle={`${stats?.paidStudents || 0}/${stats?.totalStudents || 0} pagados`}
          />
          <StatCard
            title="Progreso Olimpiada"
            value={isLoading ? "..." : `${stats?.olympiadProgress || 0}%`}
            icon={BarChart3}
            trend={`${stats?.activeStudents || 0} activos`}
            color="purple"
            subtitle={`${stats?.completionRate?.toFixed(1) || 0}% tasa finalización`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Actividad Reciente */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    <Clock className="w-5 h-5" style={{ color: '#FF0098' }} />
                    Actividad Reciente
                  </CardTitle>
                  <CardDescription>
                    Eventos y logros destacados de las Olimpiadas Bilingües 2025
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <p className="text-muted-foreground">Cargando actividades...</p>
                ) : (
                  activities.map((activity) => (
                    <ActivityItem key={activity.id} {...activity} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'var(--font-montserrat)' }} className="font-semibold">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/challenges/new" className="block">
                  <button
                    className="w-full h-24 px-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#FF0098', color: '#FFFFFF', fontFamily: 'var(--font-poppins)' }}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="font-semibold text-sm">Crear Pregunta</span>
                  </button>
                </Link>
                <Link href="/dashboard/students" className="block">
                  <button
                    className="w-full h-24 px-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#33CC00', color: '#000000', fontFamily: 'var(--font-poppins)' }}
                  >
                    <Users className="w-6 h-6" />
                    <span className="font-semibold text-sm">Gestionar Estudiantes</span>
                  </button>
                </Link>
                <Link href="/dashboard/statistics" className="block">
                  <button
                    className="w-full h-24 px-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#44B07F', color: '#FFFFFF', fontFamily: 'var(--font-poppins)' }}
                  >
                    <TrendingUp className="w-6 h-6" />
                    <span className="font-semibold text-sm">Ver Reportes</span>
                  </button>
                </Link>
                <Link href="/dashboard/schools" className="block">
                  <button
                    className="w-full h-24 px-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#CCFF00', color: '#000000', fontFamily: 'var(--font-poppins)' }}
                  >
                    <School className="w-6 h-6" />
                    <span className="font-semibold text-sm">Agregar Escuela</span>
                  </button>
                </Link>
                <Link href="/dashboard/coordinators" className="block">
                  <button
                    className="w-full h-24 px-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#9000d9', color: '#FFFFFF', fontFamily: 'var(--font-poppins)' }}
                  >
                    <UserCog className="w-6 h-6" />
                    <span className="font-semibold text-sm">Administrar Coordinadores</span>
                  </button>
                </Link>
                <Link href="/dashboard/answers" className="block">
                  <button
                    className="w-full h-24 px-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#f2bf3c', color: '#000000', fontFamily: 'var(--font-poppins)' }}
                  >
                    <FileText className="w-6 h-6" />
                    <span className="font-semibold text-sm">Revisar Respuestas</span>
                  </button>
                </Link>
                <Link href="/dashboard/challenges" className="block">
                  <button
                    className="w-full h-24 px-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#2563eb', color: '#FFFFFF', fontFamily: 'var(--font-poppins)' }}
                  >
                    <Trophy className="w-6 h-6" />
                    <span className="font-semibold text-sm">Crear Desafío</span>
                  </button>
                </Link>
                <Link href="/dashboard/statistics" className="block">
                  <button
                    className="w-full h-24 px-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#E63946', color: '#FFFFFF', fontFamily: 'var(--font-poppins)' }}
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span className="font-semibold text-sm">Ver Estadísticas</span>
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </DashboardContent>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  color: 'pink' | 'green' | 'yellow' | 'purple';
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, trend, color, subtitle }: StatCardProps) {
  const colorClasses = {
    pink: 'from-pink-500 to-pink-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600'
  };

  const bgColorClasses = {
    pink: '#FF0098',
    green: '#33CC00',
    yellow: '#f2bf3c',
    purple: '#9000d9'
  };

  return (
    <Card className="hover:shadow-lg transition-all hover:scale-105" style={{ fontFamily: 'var(--font-poppins)' }}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: bgColorClasses[color] }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'var(--font-poppins)' }}>
            {trend}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{title}</p>
        <p className="text-3xl font-bold mb-1" style={{ color: bgColorClasses[color], fontFamily: 'var(--font-montserrat)' }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-poppins)' }}>{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  id: string;
  user: string;
  action: string;
  item: string;
  time: string;
  avatar: string;
  type?: 'payment' | 'achievement' | 'registration' | 'completion' | 'review' | 'milestone';
}

function ActivityItem({ user, action, item, time, avatar, type }: ActivityItemProps) {
  const getTypeStyles = () => {
    switch(type) {
      case 'payment':
        return { bg: '#33CC00', text: '#000' };
      case 'achievement':
        return { bg: '#f2bf3c', text: '#000' };
      case 'registration':
        return { bg: '#FF0098', text: '#FFF' };
      case 'completion':
        return { bg: '#44B07F', text: '#FFF' };
      case 'review':
        return { bg: '#2563eb', text: '#FFF' };
      case 'milestone':
        return { bg: '#9000d9', text: '#FFF' };
      default:
        return { bg: '#6b7280', text: '#FFF' };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors">
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl flex-shrink-0"
        style={{ backgroundColor: styles.bg, color: styles.text }}
      >
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
          <span className="font-semibold text-gray-900">{user}</span>{' '}
          <span className="text-gray-700">{action}</span>{' '}
          <span className="font-semibold" style={{ color: styles.bg }}>{item}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}


export default Dashboard;
