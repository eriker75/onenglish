"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Database, Settings, Calendar } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    year: "2025",
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    registrationDeadline: "2025-02-15",
    maxStudentsPerSchool: "50",
    maxQuestionsPerGrade: "20",
    passingScore: "70",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    // Simulate saving
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <DashboardContent>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Configuración del Sistema
          </h1>
          <p className="text-muted-foreground">
            Administra la configuración general de las Olimpiadas Bilingües
          </p>
        </div>

        {/* Olympics Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Configuración de Olimpiadas 2025
            </CardTitle>
            <CardDescription>
              Parámetros principales del evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Año</label>
                <Input
                  name="year"
                  value={settings.year}
                  onChange={handleChange}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha de Inicio</label>
                <Input
                  type="date"
                  name="startDate"
                  value={settings.startDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha de Finalización</label>
                <Input
                  type="date"
                  name="endDate"
                  value={settings.endDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha Límite de Registro</label>
                <Input
                  type="date"
                  name="registrationDeadline"
                  value={settings.registrationDeadline}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Máximo de Estudiantes por Escuela
                </label>
                <Input
                  type="number"
                  name="maxStudentsPerSchool"
                  value={settings.maxStudentsPerSchool}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Máximo de Preguntas por Grado
                </label>
                <Input
                  type="number"
                  name="maxQuestionsPerGrade"
                  value={settings.maxQuestionsPerGrade}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Puntuación Mínima de Aprobación (%)
                </label>
                <Input
                  type="number"
                  name="passingScore"
                  value={settings.passingScore}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {isSaved && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-700 text-sm font-medium">Cambios guardados exitosamente</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700">
                Guardar Cambios
              </Button>
              <Button variant="outline">
                Restablecer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Versión:</span>
                  <span className="font-semibold">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado de BD:</span>
                  <Badge className="bg-green-100 text-green-700">Activa</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Último Backup:</span>
                  <span className="font-semibold text-sm">2025-01-15 10:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servidor:</span>
                  <Badge variant="outline">Operativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Estado de las Olimpiadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Registro Abierto</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Preparación de Preguntas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Evento Pendiente</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Aviso Importante</h3>
              <p className="text-sm text-yellow-800">
                Los cambios en la configuración pueden afectar a todos los usuarios del sistema. 
                Por favor, asegúrese de que todos los administradores estén notificados antes de realizar cambios críticos.
              </p>
            </div>
          </CardContent>
        </Card>
      </DashboardContent>
    </div>
  );
};

export default SettingsPage;
