import { PrismaClient } from "@prisma/client";
import { text } from "stream/consumers";
const prisma = new PrismaClient();

const TEST_ID = "7996e58f-68e0-5edd-92b4-f1725bf1877d";
const TEST_CODE = "HAD";
const TEST_TITLE = "Escala Hospitalaria de Ansiedad y Depresión (HAD)";
const TEST_DESC = "";

//D (Depression) -- A (Anxiety)
const questionsData = [
    {
        code: "A1",
        prompt: "Me siento tenso o nervioso",
        sectionCode: "A",
        options:[
            {label: "Todos los días", scoreValue: 3},
            {label: "Muchas veces", scoreValue: 2},
            {label: "A veces", scoreValue: 1},
            {label: "Nunca", scoreValue: 0}
        ]
    },
    {
        code: "D1",
        prompt: "Todavía disfruto con lo que me ha gustado hacer",
        sectionCode: "D",
        options:[
            {label: "Como siempre", scoreValue: 0},
            {label: "No lo bastante", scoreValue: 1},
            {label: "Sólo un poco", scoreValue: 2},
            {label: "Nada", scoreValue: 3}
        ]
    },
    {
        code: "A2",
        prompt: "Tengo una sensación de miedo, como si algo horrible fuera a suceder",
        sectionCode: "A",
        options:[
            {label: "Definitivamente y es muy fuerte", scoreValue: 3},
            {label: "Sí, pero no es muy fuerte", scoreValue: 2},
            {label: "Un poco, pero no me preocupa", scoreValue: 1},
            {label: "Nada", scoreValue: 0}
        ]
    },
    {
        code: "D2",
        prompt: "Puedo reirme y ver el lado positivo de las cosas",
        sectionCode: "D",
        options:[
            {label: "Al igual que siempre lo hice", scoreValue: 0},
            {label: "No tanto ahora", scoreValue: 1},
            {label: "Casi nunca", scoreValue: 2},
            {label: "Nunca", scoreValue: 3}
        ]
    },
    {
        code: "A3",
        prompt: "Tengo mi mente llena de preocupaciones",
        sectionCode: "A",
        options:[
            {label: "La mayoría de las veces", scoreValue: 3},
            {label: "Con bastante frecuencia", scoreValue: 2},
            {label: "A veces, aunque no muy seguido", scoreValue: 1},
            {label: "Sólo en ocasiones", scoreValue: 0}
        ]
    },
    {
        code: "D3",
        prompt: "Me siento alegre",
        sectionCode: "D",
        options:[
            {label: "Nunca", scoreValue: 3},
            {label: "No muy seguido", scoreValue: 2},
            {label: "A veces", scoreValue: 1},
            {label: "Casi siempre", scoreValue: 0}
        ]
    },
    {
        code: "A4",
        prompt: "Puedo estar sentado tranquilamente y sentirme relajado",
        sectionCode: "A",
        options:[
            {label: "Siempre", scoreValue: 0},
            {label: "Por lo general", scoreValue: 1},
            {label: "No muy seguido", scoreValue: 2},
            {label: "Nunca", scoreValue: 3}
        ]
    },
    {
        code: "D4",
        prompt: "Siento como si yo cada día estuviera más lento",
        sectionCode: "D",
        options:[
            {label: "Por lo general en todo momento", scoreValue: 3},
            {label: "Muy seguido", scoreValue: 2},
            {label: "A veces", scoreValue: 1},
            {label: "Nunca", scoreValue: 0}
        ]
    },
    {
        code: "A5",
        prompt: "Tengo una sensación extraña, como de aleteo o vacío en el estómago",
        sectionCode: "A",
        options:[
            {label: "Nunca", scoreValue: 0},
            {label: "En ciertas ocasiones", scoreValue: 1},
            {label: "Con bastante frecuencia", scoreValue: 2},
            {label: "Muy seguido", scoreValue: 3}
        ]
    },
    {
        code: "D5",
        prompt: "He perdido el deseo de estar bien arreglado o presentado",
        sectionCode: "D",
        options:[
            {label: "Totalmente", scoreValue: 3},
            {label: "No me preocupa como deberiera", scoreValue: 2},
            {label: "Podría tener un poco más de cuidado", scoreValue: 1},
            {label: "Me preocupo al igual que siempre", scoreValue: 0}
        ]
    },
    {
        code: "A6",
        prompt: "Me siento inquieto, como si no pudiera parar de moverme",
        sectionCode: "A",
        options:[
            {label: "Mucho", scoreValue: 3},
            {label: "Bastante", scoreValue: 2},
            {label: "No mucho", scoreValue: 1},
            {label: "Nada", scoreValue: 0}
        ]
    },
    {
        code: "D6",
        prompt: "Me siento con esperanzas respecto al futuro",
        sectionCode: "D",
        options:[
            {label: "Igual que siempre", scoreValue: 0},
            {label: "menos de lo que acostumbraba", scoreValue: 1},
            {label: "Mucho menos de lo que acostumbraba", scoreValue: 2},
            {label: "Nada", scoreValue: 3}
        ]
    },
    {
        code: "A7",
        prompt: "Presento una sensación de miedo muy intenso de un momento a otro",
        sectionCode: "A",
        options:[
            {label: "Muy frecuentemente", scoreValue: 3},
            {label: "Bastante seguido", scoreValue: 2},
            {label: "No muy seguido", scoreValue: 1},
            {label: "Nada", scoreValue: 0}
        ]
    },
    {
        code: "D7",
        prompt: "Me divierto con un buen libro, la radio o un programa de televisión",
        sectionCode: "D",
        options:[
            {label: "Seguido", scoreValue: 0},
            {label: "A veces", scoreValue: 1},
            {label: "No muy seguido", scoreValue: 2},
            {label: "Rara vez", scoreValue: 3}
        ]
    }
];

async function main() {
    console.log(`Iniciando el sembrado (seeding) de la base de datos...`);
    await prisma.$transaction(async (tx) => {
        console.log(`[1/5] Limpiando datos antiguos del test ${TEST_ID}...`);
            await tx.questionOption.deleteMany({
                where: {question: {test: {testCode: TEST_CODE}}} ,} );
            
            await tx.question.deleteMany({where: {test: {testCode: TEST_CODE} } } );
            await tx.testSection.deleteMany({where: {test: {testCode: TEST_CODE} } } );
            await tx.test.deleteMany ({where: {OR: [{testId: TEST_ID}, {testCode: TEST_CODE} ] } } )

        //2. Crear el test
        console.log(`[2/5] Creando test: ${TEST_TITLE}`);
                const newTest = await tx.test.create(
                    { 
                        data: 
                        {
                            testId: TEST_ID,
                            testCode: TEST_CODE,
                            title: TEST_TITLE,
                            description: TEST_DESC,
                            isPublished: true,
                        }
                    });

        //3. Crear las secciones
        console.log(`[3/5] Creando secciones (subescalas)...`);
        const sectionA = await tx.testSection.create({
            data:
            {
                testId: newTest.testId!,
                testSectionCode: "A",
                name: "Ansiedad"
            }});
        const sectionD = await tx.testSection.create({
            data:
            {
                testId: newTest.testId!,
                testSectionCode: "D",
                name: "Depresion"
            }});
        
        //Mapeo
        const sectionMap = {
            A : sectionA.testSectionId, 
            D : sectionD.testSectionId
        };

        //4. Crear preguntas y opciones
        console.log(`[4/5] Creando ${questionsData.length} preguntas con sus opciones...`);

        for(const q of questionsData){
            await tx.question.create({
                data: 
                {
                    testId: newTest.testId!,
                    testSectionId: sectionMap[q.sectionCode as "A" | "D"],
                    code: q.code,
                    prompt: q.prompt,

                    questionOption: 
                    {
                        createMany: 
                        {
                            data: q.options.map((opt)=> 
                                (
                                    {
                                        label: opt.label,
                                        scoreValue: opt.scoreValue
                                    }
                                )) 
                        }
                    }
                }
            });
        }
        });
       console.log(`[5/5] ¡Test HADA creado exitosamente!`);
}

main().catch((e) => 
    {
    console.error(e);
    process.exit(1);
    }).finally(async () => 
        {
            await prisma.$disconnect();
        });