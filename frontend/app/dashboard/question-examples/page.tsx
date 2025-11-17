"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import { questionTypesByArea, QuestionType } from "@/app/dashboard/challenges/[challengeId]/components/questionTypes";

export default function QuestionExamplesPage() {
  const router = useRouter();

  // Obtener todos los tipos de preguntas de todas las áreas
  const allQuestionTypes: QuestionType[] = Object.values(questionTypesByArea).flat();

  const handleSelectQuestionType = (questionType: QuestionType) => {
    // Convertir guiones bajos a guiones medios en la URL
    const urlId = questionType.id.replace(/_/g, '-');
    router.push(`/dashboard/question-examples/${urlId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <DashboardContent>
        <div className="space-y-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
              Question Component Examples
            </h1>
            <p className="text-gray-600">
              Select a question type to visualize and test its component
            </p>
          </div>

          {/* Grid de tipos de preguntas por área */}
          {Object.entries(questionTypesByArea).map(([area, questionTypes]) => (
            <div key={area} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{area}</h2>
                <p className="text-gray-600 text-sm">
                  Select a question type to see its component preview
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleSelectQuestionType(type)}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#44b07f] hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-[#44b07f]/10 transition-colors">
                          <Icon className="text-gray-600 group-hover:text-[#44b07f]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {type.name}
                          </h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DashboardContent>
    </div>
  );
}
