import Image from "next/image";
import aboutImage from "../../../../images/image 1.jpeg";

export default function AboutPage() {
  return (
    <div className="container max-w-3xl px-4 py-14 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">About Rugby Refereeing Academy</h1>
      <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
        Referee Academy is a rugby referee coaching and performance review
        service created by referees, for referees. We believe every referee
        deserves access to professional feedback to develop their skills.
      </p>
      <div className="mt-8 overflow-hidden rounded-xl border">
        <Image
          src={aboutImage}
          alt="Referees and coaches supporting development"
          className="h-auto w-full object-cover"
          priority
        />
      </div>
      <div className="mt-10 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Our mission</h2>
          <p className="text-muted-foreground mt-2">
            To support referees at every level with expert analysis, constructive
            feedback, and coaching that helps them perform at their best. We
            combine match footage review with performance statistics and
            one-to-one style insights.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">What we offer</h2>
          <p className="text-muted-foreground mt-2">
            We offer two core services: <strong>Performance Review</strong>—
            where a professional reviewer analyses your match and delivers
            feedback and stats—and <strong>Coaching</strong>—where you complete a
            self-review first, then a coach reviews both your match and your
            self-assessment to provide deeper discussion and development
            insights.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">International reach</h2>
          <p className="text-muted-foreground mt-2">
            Our platform supports referees around the world. Our coaches and
            reviewers work across multiple languages and competitions, and we
            aim to make professional development accessible regardless of
            location.
          </p>
        </section>
      </div>
    </div>
  );
}
