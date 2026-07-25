import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Política de Tratamiento de Datos Personales",
};

export default function DataPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#102D69]">
              Política de Tratamiento de Datos Personales
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Última actualización: 25 de Julio del 2026
            </p>

            <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
              <p>
                Dando cumplimiento a lo dispuesto en la Ley 1581 de 2012, "Por el cual se dictan disposiciones generales para la protección de datos personales" y de conformidad con lo señalado en el Decreto 1377 de 2013, manifiesto que otorgo mi autorización expresa y clara a este proyecto de investigación, para que puedan hacer tratamiento y uso de mis datos personales, los cuales estarán cuidadosamente guardados en la base de datos de la que es responsable dicho proyecto.
                De acuerdo a la normatividad citada, este proyecto de investigación queda autorizado de manera expresa e inequívoca para mantener y manejar la información suministrada, solo para aquellas finalidades para las que se encuentra facultado y respetando en todo caso, la normatividad vigente sobre protección de datos personales.
                Personales en Colombia.
              </p>

              <section>
                <h2 className="text-xl font-semibold text-[#102D69]">
                  1. Responsable del tratamiento
                </h2>
                <p className="mt-2">
                  Instituto Tecnologico Metropolitano (ITM)  , identificada
                  con NIT 800214750, con domicilio en Cl. 54a #30-01, Medellín,
                  actuando como responsable del tratamiento de los datos
                  personales recolectados a través del presente sistema de
                  autoevaluación psicológica.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#102D69]">
                  2. Finalidad del tratamiento
                </h2>
                <p className="mt-2">
                  Los datos personales suministrados durante el registro y el
                  uso de la plataforma serán utilizados para:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-1">
                  <li>
                    Gestionar la creación y administración de la cuenta de
                    usuario.
                  </li>
                  <li>
                    Aplicar, calcular e interpretar los instrumentos de
                    autoevaluación psicológica asignados.
                  </li>
                  <li>
                    Permitir el seguimiento clínico por parte de los
                    profesionales de psicología autorizados.
                  </li>
                  <li>
                    Generar reportes estadísticos y de seguimiento
                    institucional, en los casos permitidos por la ley.
                  </li>
                  <li>
                    Enviar comunicaciones asociadas al servicio (verificación
                    de correo, notificaciones, recuperación de contraseña).
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#102D69]">
                  3. Datos sensibles
                </h2>
                <p className="mt-2">
                  Los resultados de las pruebas psicológicas constituyen{" "}
                  <strong>datos sensibles relacionados con la salud</strong> en
                  los términos del artículo 5 de la Ley 1581 de 2012. Su
                  tratamiento requiere el consentimiento previo, expreso e
                  informado del titular, el cual se otorga mediante la
                  aceptación explícita de esta política durante el registro.
                  El titular no está obligado a autorizar el tratamiento de
                  estos datos; sin embargo, dicha autorización es
                  indispensable para poder acceder a las funcionalidades de
                  autoevaluación de la plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#102D69]">
                  4. Derechos del titular
                </h2>
                <p className="mt-2">
                  De acuerdo con el artículo 8 de la Ley 1581 de 2012, el
                  titular de los datos tiene derecho a:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-1">
                  <li>
                    Conocer, actualizar y rectificar sus datos personales.
                  </li>
                  <li>
                    Solicitar prueba de la autorización otorgada.
                  </li>
                  <li>
                    Ser informado sobre el uso dado a sus datos personales.
                  </li>
                  <li>
                    Presentar quejas ante la Superintendencia de Industria y
                    Comercio por infracciones a la normativa vigente.
                  </li>
                  <li>
                    Revocar la autorización y/o solicitar la supresión de sus
                    datos, cuando no exista un deber legal o contractual que
                    impida su eliminación.
                  </li>
                  <li>Acceder de forma gratuita a sus datos personales.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#102D69]">
                  5. Procedimiento para ejercer los derechos
                </h2>
                <p className="mt-2">
                  El titular podrá ejercer sus derechos enviando una solicitud
                  al correo electrónico [correo de contacto pendiente],
                  indicando su nombre completo, tipo de solicitud y datos de
                  contacto. La solicitud será atendida dentro de los términos
                  establecidos por la ley.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#102D69]">
                  6. Almacenamiento y seguridad
                </h2>
                <p className="mt-2">
                  Los datos personales se almacenan en bases de datos con
                  medidas de seguridad técnicas, humanas y administrativas
                  razonables, con el fin de evitar su alteración, pérdida,
                  consulta, uso o acceso no autorizado.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#102D69]">
                  7. Vigencia
                </h2>
                <p className="mt-2">
                  Los datos personales serán conservados durante el tiempo
                  necesario para cumplir las finalidades descritas y los
                  plazos exigidos por la normativa aplicable en materia de
                  historia clínica y archivos institucionales.
                </p>
              </section>

              <p className="text-sm text-slate-500">
                Para dudas sobre esta política, comunícate al correo
                neurolab@itm.edu.co.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex rounded-xl bg-gradient-to-r from-[#102D69] to-[#00A0B7] px-5 py-3 text-sm font-semibold text-white"
              >
                Volver al inicio
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
