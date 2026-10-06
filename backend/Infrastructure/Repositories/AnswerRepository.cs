using Backend.Domain;
using Backend.Domain.Repositories;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class AnswerRepository : IAnswerRepository
{
    private readonly AppDbContext _context;

    public AnswerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Answer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Answers
            .Include(a => a.Author)
            .Include(a => a.Likes)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

    public async Task<IEnumerable<Answer>> GetAllByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken = default)
        => await _context.Answers
            .Where(a => a.QuestionId == questionId)
            .Include(a => a.Author)
            .Include(a => a.Likes)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<Answer> AddAsync(Answer answer, CancellationToken cancellationToken = default)
    {
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync(cancellationToken);
        return answer;
    }

    public async Task Update(Answer answer, CancellationToken cancellationToken = default)
    {
        _context.Answers.Update(answer);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Delete(Answer answer, CancellationToken cancellationToken = default)
    {
        _context.Answers.Remove(answer);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Answers.AnyAsync(a => a.Id == id, cancellationToken);

    public async Task<int> GetLikesCountAsync(Guid answerId, CancellationToken cancellationToken = default)
        => await _context.AnswerLikes.CountAsync(al => al.AnswerId == answerId, cancellationToken);

    public async Task<bool> UserLikedAsync(Guid userId, Guid answerId, CancellationToken cancellationToken = default)
        => await _context.AnswerLikes.AnyAsync(al => al.UserId == userId && al.AnswerId == answerId, cancellationToken);

    public async Task AddLikeAsync(AnswerLike like, CancellationToken cancellationToken = default)
    {
        _context.AnswerLikes.Add(like);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveLikeAsync(Guid userId, Guid answerId, CancellationToken cancellationToken = default)
    {
        var like = await _context.AnswerLikes.FindAsync(new object[] { userId, answerId }, cancellationToken);
        if (like is not null)
        {
            _context.AnswerLikes.Remove(like);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}