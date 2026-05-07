export const knowledgeBase = [
  {
    id: 1,
    subject: 'Algorithms',
    title: 'Asymptotic Notations',
    content: `Big-O: upper bound (at most). f=O(g): f grows no faster than g.
Big-Ω: lower bound (at least). f=Ω(g): f grows at least as fast as g.
Big-Θ: tight bound. f=Θ(g): f grows at exactly the same rate as g.

Complexity order (fast → slow):
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)

Master Theorem: T(n) = aT(n/b) + f(n)
Compare f(n) vs n^log_b(a) to determine case.`,
  },
  {
    id: 2,
    subject: 'Algorithms',
    title: 'Data Structures Complexity',
    content: `Array: access O(1), search O(n), insert/delete O(n)
Singly Linked List: access O(n), insert-head O(1), delete-with-pointer O(n)
Doubly Linked List: delete-with-pointer O(1)
Stack/Queue: push/pop/enqueue/dequeue all O(1)
Binary Search Tree: O(log n) average, O(n) worst
MaxHeap: insert O(log n), extract-max O(log n), build-heap O(n)
Hash Table: O(1) average, O(n) worst for get/set`,
  },
  {
    id: 3,
    subject: 'ML',
    title: 'PyTorch nn.Module Cheatsheet',
    content: `Class template:
  class MyNet(nn.Module):
    def __init__(self):
      super().__init__()
      self.fc = nn.Linear(64, 10)
    def forward(self, x):
      return self.fc(x)

Training loop order:
  zero_grad → forward → loss → backward → step

model(x) calls __call__ which calls forward(x)

Auto-registered:
  ✓ nn.Parameter
  ✓ submodule's parameters
  ✗ plain Tensor (use nn.Parameter to register)`,
  },
  {
    id: 4,
    subject: 'ML',
    title: 'Bias-Variance & Regularization',
    content: `Underfitting = high bias:
  → low train accuracy, low test accuracy
  → Fix: more complex model, more features, less regularization

Overfitting = high variance:
  → high train accuracy, low test accuracy
  → Fix: more data, dropout, L1/L2, early stopping, augmentation

Regularization methods:
  L1 (lasso), L2 (ridge/weight decay), Dropout,
  Early stopping, Data augmentation

Normalization constants: always computed from TRAINING set only
  (applying test stats = data leakage)`,
  },
  {
    id: 5,
    subject: 'ML',
    title: 'CNN Architecture',
    content: `Convolution output size:
  floor((W - F + 2P) / S) + 1
  W=input, F=filter, P=padding, S=stride

Max pooling: take max in each non-overlapping window

Batch normalization: normalize per mini-batch during training
Dropout: randomly zero neurons during training only (p=drop prob)
Residual connections: y = F(x) + x (skip connection)
  → Solves vanishing gradient, enables very deep networks

t-SNE: dimensionality reduction for visualization (non-parametric)

TorchScript:
  Tracing: follows one path → loses branches/loops
  Scripting: parses code → preserves control flow`,
  },
  {
    id: 6,
    subject: 'Math1',
    title: 'Proof & Functions',
    content: `Mathematical Induction:
  1. Base case: verify P(1) is true
  2. Inductive hypothesis: assume P(k) is true
  3. Inductive step: prove P(k+1) follows from P(k)

Function properties:
  Injective (1-to-1): f(a)=f(b) ⟹ a=b
  Surjective (onto): ∀y ∃x: f(x)=y (range = codomain)
  Bijective: injective + surjective → invertible

Linear systems Ax=b:
  Gaussian elimination → row echelon form → back-substitute
  0 = nonzero row → no solution
  Free variable → infinitely many solutions`,
  },
  {
    id: 7,
    subject: 'Math2',
    title: 'Calculus Essentials',
    content: `L'Hôpital's Rule:
  Apply when limit gives 0/0 or ∞/∞
  lim f/g = lim f'/g' (can apply repeatedly)
  Rewrite 0·∞ or ∞-∞ algebraically first

Integration by parts:
  ∫u dv = uv - ∫v du
  LIATE rule for u: Logarithmic, Inverse trig,
  Algebraic, Trigonometric, Exponential

Positive definite (Sylvester's criterion):
  All leading principal minors > 0
  Equivalent: all eigenvalues > 0

Lagrange multipliers:
  Minimize/maximize f(x,y) subject to g(x,y) = c
  Solve: ∇f = λ∇g AND g(x,y) = c
  Evaluate f at all critical points, compare values`,
  },
  {
    id: 8,
    subject: 'Statistics',
    title: 'Tests & Distributions',
    content: `Two-sample t-test:
  t = (x̄₁-x̄₂) / √(s₁²/n₁ + s₂²/n₂)
  df = n₁+n₂-2 (equal variance)

CI for mean (unknown σ):
  x̄ ± t_{α/2, n-1} · s/√n
  Key t-values: df=8 → t=2.306 | z (df=∞) → 1.96

Normal distribution — 68-95-99.7 rule:
  μ±1σ → 68.3%
  μ±2σ → 95.4%
  μ±3σ → 99.7%

Poisson: P(X=k) = e^(-λ)λᵏ/k!
  Mean = Variance = λ
  Use for: event counts in fixed time/space

Bayes' theorem:
  P(A|B) = P(B|A)·P(A) / [P(B|A)·P(A) + P(B|Ā)·P(Ā)]
  The prior P(A) matters enormously`,
  },
]
