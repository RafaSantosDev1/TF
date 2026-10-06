using Backend.Domain;
using Backend.Domain.Enums;
using Backend.Domain.Repositories;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class QuestionRepository : IQuestionRepository
{
    private readonly AppDbContext _context;

    public QuestionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Question?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Questions
            .Include(q => q.Author)
            .Include(q => q.Answers)
                .ThenInclude(a => a.Author)
            .Include(q => q.Answers)
                .ThenInclude(a => a.Likes)
            .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);

    public async Task<IEnumerable<Question>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Questions
            .Include(q => q.Author)
            .Include(q => q.Answers)
                .ThenInclude(a => a.Author)
            .Include(q => q.Answers)
                .ThenInclude(a => a.Likes)
            .OrderByDescending(q => q.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<IEnumerable<Question>> GetByAreaAsync(Area area, CancellationToken cancellationToken = default)
        => await _context.Questions
            .Where(q => q.Area == area)
            .Include(q => q.Author)
            .Include(q => q.Answers)
                .ThenInclude(a => a.Author)
            .Include(q => q.Answers)
                .ThenInclude(a => a.Likes)
            .OrderByDescending(q => q.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<Question> AddAsync(Question question, CancellationToken cancellationToken = default)
    {
        _context.Questions.Add(question);
        await _context.SaveChangesAsync(cancellationToken);
        return question;
    }

    public async Task Update(Question question, CancellationToken cancellationToken = default)
    {
        _context.Questions.Update(question);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Delete(Question question, CancellationToken cancellationToken = default)
    {
        _context.Questions.Remove(question);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Questions.AnyAsync(q => q.Id == id, cancellationToken);
}