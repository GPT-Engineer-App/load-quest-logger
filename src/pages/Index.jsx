import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Cat, Heart, Info, ChevronLeft, ChevronRight, Paw, Star, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const catImages = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Kittyply_edit1.jpg/1200px-Kittyply_edit1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sleeping_cat_on_her_back.jpg/1200px-Sleeping_cat_on_her_back.jpg",
];

const quizQuestions = [
  { question: "What is a group of cats called?", options: ["Clowder", "Pack", "Herd", "Flock"], correct: "Clowder" },
  { question: "How many toes does a cat typically have?", options: ["16", "18", "20", "22"], correct: "18" },
  { question: "What is the average lifespan of a domestic cat?", options: ["5-10 years", "10-15 years", "15-20 years", "20-25 years"], correct: "15-20 years" },
];

const Index = () => {
  const [likes, setLikes] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [catFact, setCatFact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % catImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchCatFact();
  }, []);

  const fetchCatFact = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://catfact.ninja/fact');
      const data = await response.json();
      setCatFact(data.fact);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
      setCatFact("Oops! Couldn't fetch a cat fact right now.");
    }
    setIsLoading(false);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === quizQuestions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setQuizStarted(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-purple-200 to-pink-200">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold mb-6 text-center text-purple-800"
        >
          Purrfect Cat World
        </motion.h1>

        <Alert className="mb-6">
          <Star className="h-4 w-4" />
          <AlertTitle>Did you know?</AlertTitle>
          <AlertDescription>
            {isLoading ? (
              <span className="animate-pulse">Loading cat fact...</span>
            ) : (
              catFact
            )}
          </AlertDescription>
        </Alert>
        
        <div className="relative mb-8 overflow-hidden rounded-lg shadow-lg">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImageIndex}
              src={catImages[currentImageIndex]}
              alt={`Cute cat ${currentImageIndex + 1}`}
              className={`mx-auto object-cover w-full h-[400px] cursor-pointer transition-transform duration-300 ${isImageZoomed ? 'scale-110' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            />
          </AnimatePresence>
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <p className="text-white text-lg">Click to zoom</p>
          </motion.div>
          <Button 
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/75"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex((prevIndex) => (prevIndex - 1 + catImages.length) % catImages.length);
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/75"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex((prevIndex) => (prevIndex + 1) % catImages.length);
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <Tabs defaultValue="characteristics" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
            <TabsTrigger value="breeds">Popular Breeds</TabsTrigger>
          </TabsList>
          <TabsContent value="characteristics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2" /> Characteristics of Cats
                </CardTitle>
                <CardDescription>What makes cats unique?</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-none pl-6">
                  {["Independent nature", "Excellent hunters with sharp claws and teeth", "Flexible bodies and quick reflexes", "Keen senses, especially hearing and night vision", "Communicate through vocalizations, body language, and scent"].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="mb-2 flex items-center"
                    >
                      <Paw className="mr-2 text-purple-600" size={16} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="breeds">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cat className="mr-2" /> Popular Cat Breeds
                </CardTitle>
                <CardDescription>Some well-known cat breeds around the world</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-none pl-6">
                  {[
                    { breed: "Siamese", description: "Known for their distinctive coloring and vocal nature", origin: "Thailand" },
                    { breed: "Maine Coon", description: "Large, fluffy cats with tufted ears", origin: "United States" },
                    { breed: "Persian", description: "Recognizable by their flat faces and long, luxurious coats", origin: "Iran" },
                    { breed: "Bengal", description: "Wild-looking cats with leopard-like spots", origin: "United States" },
                    { breed: "Scottish Fold", description: "Characterized by their folded ears", origin: "Scotland" }
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="mb-4"
                    >
                      <strong className="text-purple-700">{item.breed}</strong>
                      <Badge variant="outline" className="ml-2">{item.origin}</Badge>
                      <p className="mt-1">{item.description}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Cat className="mr-2" /> Cat Quiz
            </CardTitle>
            <CardDescription>Test your cat knowledge!</CardDescription>
          </CardHeader>
          <CardContent>
            {!quizStarted ? (
              <Button onClick={() => { setQuizStarted(true); setCurrentQuestionIndex(0); setScore(0); }} className="w-full">
                Start Quiz
              </Button>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">{quizQuestions[currentQuestionIndex].question}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleAnswer(option)}
                        className={`w-full ${
                          selectedAnswer === option
                            ? option === quizQuestions[currentQuestionIndex].correct
                              ? "bg-green-500"
                              : "bg-red-500"
                            : ""
                        }`}
                        disabled={selectedAnswer !== null}
                      >
                        {option}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Progress className="mt-4" value={(currentQuestionIndex + 1) / quizQuestions.length * 100} />
                {!quizStarted && (
                  <motion.p 
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Your score: {score}/{quizQuestions.length}
                  </motion.p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => {
                    setLikes(likes + 1);
                    toast({
                      title: "Meow!",
                      description: "Thanks for showing your love!",
                      duration: 2000,
                    });
                  }}
                  className="bg-pink-500 hover:bg-pink-600 transform transition-transform duration-200 hover:scale-105"
                >
                  <Heart className="mr-2" /> Like Cats ({likes})
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show your love for cats!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            onClick={fetchCatFact}
            className="bg-purple-500 hover:bg-purple-600 transform transition-transform duration-200 hover:scale-105"
          >
            <Gift className="mr-2" /> New Cat Fact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
