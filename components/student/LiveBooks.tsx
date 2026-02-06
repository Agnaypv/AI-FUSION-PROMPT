"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, BookOpen, Star, Play, CheckCircle, Clock, Award, Sparkles } from "lucide-react"
import CrosswordGame from "@/components/games/CrosswordGame"
import TimeTravelClassroom from "@/components/games/TimeTravelClassroom"

interface Chapter {
  id: string
  title: string
  summary: string
  topics: string[]
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: number
  completed: boolean
  rating?: number
  content?: string
}

interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface LiveBooksProps {
  subjectId: string
  onClose: () => void
}

export default function LiveBooks({ subjectId, onClose }: LiveBooksProps) {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showCrossword, setShowCrossword] = useState(false)
  const [showTimeTravelGame, setShowTimeTravelGame] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [userRating, setUserRating] = useState<number | null>(null)

  const getSubjectData = (subjectId: string) => {
    const subjects = {
      english: {
        name: "English",
        chapters: [
          {
            id: "ch1",
            title: "The Fun They Had - Isaac Asimov",
            summary:
              "A futuristic story about Margie and Tommy who discover an old book about schools from the past. The story explores themes of education, technology, and human connection through the eyes of children in 2157.",
            topics: ["Future Technology", "Education Systems", "Character Analysis", "Theme Exploration"],
            difficulty: "Easy" as const,
            estimatedTime: 30,
            completed: true,
            rating: 4,
            content:
              "In the year 2157, Margie and Tommy are taught by mechanical teachers in their homes. When they find a real book about old-fashioned schools, they wonder about the fun children had learning together...",
          },
          {
            id: "ch2",
            title: "The Sound of Music - Deborah Cowley",
            summary:
              "The inspiring story of Evelyn Glennie, who became a world-renowned percussionist despite being profoundly deaf. Learn about determination, passion, and overcoming challenges.",
            topics: ["Biography", "Overcoming Disabilities", "Music and Arts", "Inspiration"],
            difficulty: "Medium" as const,
            estimatedTime: 35,
            completed: false,
            content:
              "Evelyn Glennie's journey from a hearing-impaired girl to an internationally acclaimed musician shows us that determination can overcome any obstacle...",
          },
          {
            id: "ch3",
            title: "Grammar Fundamentals",
            summary:
              "Master the basics of English grammar including parts of speech, tenses, and sentence structure. Interactive crossword puzzles make learning grammar fun and engaging.",
            topics: ["Parts of Speech", "Tenses", "Sentence Structure", "Grammar Rules"],
            difficulty: "Easy" as const,
            estimatedTime: 25,
            completed: true,
            rating: 4,
            content:
              "Understanding grammar is the foundation of effective communication. Let's explore nouns, verbs, adjectives, and more through interactive games...",
          },
          {
            id: "ch4",
            title: "The Little Girl - Katherine Mansfield",
            summary:
              "A touching story about Kezia and her relationship with her father. Explores themes of fear, misunderstanding, and the complexity of parent-child relationships.",
            topics: ["Family Relationships", "Character Development", "Emotional Growth", "Literary Analysis"],
            difficulty: "Medium" as const,
            estimatedTime: 40,
            completed: false,
            content:
              "Kezia was afraid of her father until one night when she discovered his gentle, caring side. This story teaches us about understanding and empathy...",
          },
        ],
        weakTopics: ["Complex Sentences", "Passive Voice", "Conditional Statements"],
      },
      mathematics: {
        name: "Mathematics",
        chapters: [
          {
            id: "ch1",
            title: "Number Systems",
            summary:
              "Explore rational and irrational numbers, their properties, and operations. Learn about real numbers and their representation on the number line.",
            topics: ["Rational Numbers", "Irrational Numbers", "Real Numbers", "Number Line"],
            difficulty: "Medium" as const,
            estimatedTime: 45,
            completed: true,
            rating: 5,
            content:
              "Numbers are the foundation of mathematics. Let's explore different types of numbers and their fascinating properties...",
          },
          {
            id: "ch2",
            title: "Polynomials",
            summary:
              "Understand polynomials, their types, and operations. Learn factorization techniques and solve polynomial equations with practical applications.",
            topics: ["Types of Polynomials", "Operations", "Factorization", "Polynomial Equations"],
            difficulty: "Hard" as const,
            estimatedTime: 50,
            completed: false,
            content:
              "Polynomials are algebraic expressions with multiple terms. They appear everywhere in mathematics and have countless real-world applications...",
          },
          {
            id: "ch3",
            title: "Coordinate Geometry",
            summary:
              "Learn about the Cartesian plane, plotting points, and finding distances. Explore linear equations and their graphical representations.",
            topics: ["Cartesian Plane", "Distance Formula", "Section Formula", "Linear Equations"],
            difficulty: "Medium" as const,
            estimatedTime: 40,
            completed: false,
            content:
              "Coordinate geometry bridges algebra and geometry, allowing us to solve geometric problems using algebraic methods...",
          },
          {
            id: "ch4",
            title: "Linear Equations in Two Variables",
            summary:
              "Master linear equations with two variables, their solutions, and graphical representation. Learn to solve real-world problems using linear equations.",
            topics: ["Linear Equations", "Graphical Method", "Algebraic Method", "Applications"],
            difficulty: "Medium" as const,
            estimatedTime: 35,
            completed: true,
            rating: 4,
            content:
              "Linear equations in two variables help us model and solve many real-world situations involving relationships between quantities...",
          },
        ],
        weakTopics: ["Quadratic Equations", "Trigonometry", "Statistics"],
      },
      science: {
        name: "Science",
        chapters: [
          {
            id: "ch1",
            title: "Matter in Our Surroundings",
            summary:
              "Explore the nature of matter, its states, and properties. Learn about the particle nature of matter and how temperature and pressure affect state changes.",
            topics: ["States of Matter", "Particle Theory", "Temperature Effects", "Pressure Effects"],
            difficulty: "Easy" as const,
            estimatedTime: 35,
            completed: true,
            rating: 4,
            content:
              "Everything around us is made of matter. Let's discover the fascinating world of particles and how they behave in different conditions...",
          },
          {
            id: "ch2",
            title: "Is Matter Around Us Pure?",
            summary:
              "Distinguish between pure substances and mixtures. Learn separation techniques and understand the concept of solutions, colloids, and suspensions.",
            topics: ["Pure Substances", "Mixtures", "Separation Techniques", "Solutions"],
            difficulty: "Medium" as const,
            estimatedTime: 40,
            completed: false,
            content:
              "Not all matter is pure. Learn to identify and separate different types of mixtures using various scientific techniques...",
          },
          {
            id: "ch3",
            title: "Atoms and Molecules",
            summary:
              "Understand the basic building blocks of matter. Learn about atomic structure, molecular composition, and chemical formulas.",
            topics: ["Atomic Structure", "Molecules", "Chemical Formulas", "Atomic Mass"],
            difficulty: "Hard" as const,
            estimatedTime: 50,
            completed: false,
            content:
              "Atoms are the fundamental units of matter. Discover how these tiny particles combine to form everything in the universe...",
          },
          {
            id: "ch4",
            title: "Structure of the Atom",
            summary:
              "Dive deeper into atomic structure. Learn about electrons, protons, neutrons, and how they are arranged within an atom.",
            topics: ["Subatomic Particles", "Electron Configuration", "Atomic Models", "Isotopes"],
            difficulty: "Hard" as const,
            estimatedTime: 45,
            completed: false,
            content:
              "The atom is not indivisible as once thought. Explore the fascinating world of subatomic particles and their arrangements...",
          },
        ],
        weakTopics: ["Chemical Bonding", "Periodic Table", "Chemical Reactions"],
      },
      social: {
        name: "Social Studies",
        chapters: [
          {
            id: "ch1",
            title: "The French Revolution",
            summary:
              "Explore one of history's most significant events. Learn about the causes, major events, and consequences of the French Revolution and its impact on the world.",
            topics: ["Causes of Revolution", "Major Events", "Key Figures", "Global Impact"],
            difficulty: "Medium" as const,
            estimatedTime: 45,
            completed: true,
            rating: 5,
            content:
              "The French Revolution changed the course of world history. Discover how the common people rose against monarchy and established new ideals...",
          },
          {
            id: "ch2",
            title: "Socialism in Europe and the Russian Revolution",
            summary:
              "Understand the rise of socialism in Europe and the Russian Revolution. Learn about the conditions that led to revolutionary changes in Russia.",
            topics: ["Socialist Ideas", "Russian Society", "1917 Revolution", "Lenin's Role"],
            difficulty: "Hard" as const,
            estimatedTime: 50,
            completed: false,
            content:
              "The Russian Revolution transformed a feudal society into a socialist state. Explore the ideas and events that shaped modern Russia...",
          },
          {
            id: "ch3",
            title: "Nazism and the Rise of Hitler",
            summary:
              "Study the rise of Nazi Germany and Hitler's dictatorship. Understand the factors that led to World War II and the Holocaust.",
            topics: ["Weimar Republic", "Nazi Ideology", "Hitler's Rise", "World War II"],
            difficulty: "Hard" as const,
            estimatedTime: 55,
            completed: false,
            content:
              "The rise of Nazism in Germany led to one of history's darkest periods. Learn about the conditions that allowed such extremism to flourish...",
          },
          {
            id: "ch4",
            title: "Forest and Wildlife Resources",
            summary:
              "Explore India's rich biodiversity and the importance of forest conservation. Learn about wildlife protection and sustainable development.",
            topics: ["Forest Types", "Wildlife Conservation", "Biodiversity", "Sustainable Development"],
            difficulty: "Easy" as const,
            estimatedTime: 35,
            completed: true,
            rating: 4,
            content:
              "India's forests and wildlife are precious natural resources. Discover the importance of conservation and our role in protecting biodiversity...",
          },
        ],
        weakTopics: ["Constitutional Design", "Electoral Politics", "Economic Development"],
      },
    }

    return subjects[subjectId as keyof typeof subjects] || subjects.english
  }

  const subjectData = getSubjectData(subjectId)

  // Sample quiz questions
  const quizQuestions: Quiz[] = [
    {
      id: "q1",
      question: "What is the main purpose of the chapter summary?",
      options: ["To replace reading", "To provide key concepts", "To test knowledge", "To waste time"],
      correctAnswer: 1,
    },
    {
      id: "q2",
      question: "Which difficulty level requires the most time investment?",
      options: ["Easy", "Medium", "Hard", "All are equal"],
      correctAnswer: 2,
    },
    {
      id: "q3",
      question: "What should you do after completing a chapter?",
      options: ["Move to next", "Rate the content", "Skip quiz", "Close book"],
      correctAnswer: 1,
    },
  ]

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId)
  }

  const handleStartQuiz = () => {
    if (subjectId === "english" && selectedChapter === "ch3") {
      setShowCrossword(true)
    } else if (subjectId === "social") {
      setShowTimeTravelGame(true)
    } else {
      setShowQuiz(true)
      setCurrentQuiz(0)
      setQuizScore(0)
    }
  }

  const handleQuizAnswer = (answerIndex: number) => {
    if (answerIndex === quizQuestions[currentQuiz].correctAnswer) {
      setQuizScore((prev) => prev + 1)
    }

    if (currentQuiz + 1 < quizQuestions.length) {
      setCurrentQuiz((prev) => prev + 1)
    } else {
      // Quiz completed
      setTimeout(() => {
        setShowQuiz(false)
        setCurrentQuiz(0)
      }, 2000)
    }
  }

  const handleCrosswordComplete = (score: number) => {
    setQuizScore(score)
    setTimeout(() => {
      setShowCrossword(false)
    }, 2000)
  }

  const handleTimeTravelComplete = (score: number) => {
    setQuizScore(score)
    setTimeout(() => {
      setShowTimeTravelGame(false)
    }, 2000)
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    // Here you would typically save the rating to the backend
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (showTimeTravelGame) {
    return <TimeTravelClassroom isOpen={true} onClose={() => setShowTimeTravelGame(false)} />
  }

  if (showCrossword) {
    return <CrosswordGame onClose={() => setShowCrossword(false)} onComplete={handleCrosswordComplete} />
  }

  if (showQuiz) {
    const currentQuestion = quizQuestions[currentQuiz]
    const isLastQuestion = currentQuiz === quizQuestions.length - 1

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl bg-white shadow-2xl">
          <CardHeader className="text-center pb-4 bg-gradient-to-r from-primary to-accent text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold">Chapter Quiz</CardTitle>
            <p className="text-sm opacity-90">
              Question {currentQuiz + 1} of {quizQuestions.length}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <Progress value={((currentQuiz + 1) / quizQuestions.length) * 100} className="h-2" />

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleQuizAnswer(index)}
                      className="p-4 text-left h-auto hover:bg-primary/10 hover:border-primary/30"
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {isLastQuestion && currentQuiz === quizQuestions.length - 1 && (
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-700 font-semibold">
                    Quiz Complete! Score: {quizScore}/{quizQuestions.length}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        <CardHeader className="flex-row items-center justify-between pb-3 border-b">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Live Books - {subjectData.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <div className="flex h-[600px]">
          {/* Sidebar - Chapter List */}
          <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Chapters</h3>
              <div className="space-y-2">
                {subjectData.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedChapter === chapter.id
                        ? "bg-primary/10 border-primary/30"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-800 text-sm">{chapter.title}</h4>
                      {chapter.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className={`${getDifficultyColor(chapter.difficulty)} text-xs`}>
                        {chapter.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        {chapter.estimatedTime}m
                      </div>
                    </div>
                    {chapter.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < chapter.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Weak Topics */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  Focus Areas
                </h3>
                <div className="space-y-2">
                  {subjectData.weakTopics.map((topic, index) => (
                    <div key={index} className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm font-medium text-orange-700">{topic}</p>
                      <p className="text-xs text-orange-600">Needs more practice</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedChapter ? (
              <div className="p-6">
                {(() => {
                  const chapter = subjectData.chapters.find((c) => c.id === selectedChapter)!
                  return (
                    <div className="space-y-6">
                      {/* Chapter Header */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-2xl font-bold text-gray-800">{chapter.title}</h2>
                          <Badge className={`${getDifficultyColor(chapter.difficulty)}`}>{chapter.difficulty}</Badge>
                          {chapter.completed && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {chapter.estimatedTime} minutes
                          </div>
                          <div>{chapter.topics.length} topics covered</div>
                        </div>
                      </div>

                      {/* Chapter Summary */}
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-blue-800 mb-2">Chapter Summary</h3>
                          <p className="text-blue-700 leading-relaxed">{chapter.summary}</p>
                        </CardContent>
                      </Card>

                      {/* Topics Covered */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Topics Covered</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {chapter.topics.map((topic, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="font-medium text-gray-800">{topic}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={handleStartQuiz}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        >
                          {subjectId === "english" && selectedChapter === "ch3" ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Play Game
                            </>
                          ) : subjectId === "social" ? (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Play Game
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Take Quiz
                            </>
                          )}
                        </Button>
                        <Button variant="outline">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Read Full Chapter
                        </Button>
                      </div>

                      {/* Rating Section */}
                      <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Rate this chapter</h3>
                          <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                              <button key={i} onClick={() => handleRating(i + 1)} className="transition-colors">
                                <Star
                                  className={`w-6 h-6 ${
                                    i < (userRating || chapter.rating || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300 hover:text-yellow-300"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {userRating ? "Thanks for rating!" : "How helpful was this chapter?"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Chapter</h3>
                  <p className="text-gray-500">
                    Choose a chapter from the sidebar to view its content and take quizzes
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
