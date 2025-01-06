/**
 * A functional React component that renders a section with three articles,
 * each highlighting a feature of the platform: Verified projects, Funder Rewards,
 * and Easy Onboarding. Each article includes an icon, a title, and a descriptive
 * paragraph explaining the feature.
 *
 * @returns A JSX element representing the section with feature highlights.
 */
const Strip: React.FC = () => {
  return (
    <section className="third">
      <article>
        <div>
          <img
            src="/images/verify.png"
            alt="verifyIcon"
            width={36}
            height={36}
          />
          <h1>Verified projects</h1>
        </div>
        <p>
          Trust that your funds will take an impact with our verification system
        </p>
      </article>
      <article>
        <div>
          <img
            src="/images/donate.png"
            alt="donateIcon"
            width={36}
            height={36}
          />
          <h1>Funder Rewards</h1>
        </div>
        <p>Get rewarded to verify public goods and stacking DAOs</p>
      </article>
      <article>
        <div>
          <img
            src="/images/sparkles.png"
            alt="sparklesIcon"
            width={36}
            height={36}
          />
          <h1>Easy Onboarding</h1>
        </div>
        <p>
          Are you new to Blockchain? It's easy to get started. We will guide you
        </p>
      </article>
    </section>
  );
};

export default Strip;
